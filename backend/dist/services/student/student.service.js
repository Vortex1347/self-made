"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const jwt_1 = require("@nestjs/jwt");
const student_entity_1 = require("../../entities/student.entity");
let StudentService = class StudentService {
    constructor(studentRepo, jwtService) {
        this.studentRepo = studentRepo;
        this.jwtService = jwtService;
    }
    async listAdmin() {
        const students = await this.studentRepo.find({
            where: { isActive: true },
            order: { createdAt: 'DESC' },
        });
        return students.map((student) => this.toPublicStudent(student));
    }
    async createOrUpdateAdmin(dto) {
        const accessUntil = normalizeDate(dto.accessUntil);
        const existing = await this.studentRepo.findOne({ where: { login: dto.login } });
        if (existing && !existing.isActive) {
            existing.isActive = true;
        }
        if (existing) {
            existing.name = dto.name;
            existing.accessUntil = accessUntil;
            if (dto.password) {
                existing.passwordHash = await bcrypt.hash(dto.password, 10);
            }
            const saved = await this.studentRepo.save(existing);
            return this.toPublicStudent(saved);
        }
        if (!dto.password || dto.password.length < 4) {
            throw new common_1.BadRequestException('Password required for new student (min 4 characters)');
        }
        const created = this.studentRepo.create({
            name: dto.name,
            login: dto.login,
            accessUntil,
            passwordHash: await bcrypt.hash(dto.password, 10),
            isActive: true,
        });
        const saved = await this.studentRepo.save(created);
        return this.toPublicStudent(saved);
    }
    async updateAccessAdmin(studentId, dto) {
        const student = await this.studentRepo.findOne({ where: { id: studentId, isActive: true } });
        if (!student)
            throw new common_1.NotFoundException('Student not found');
        student.accessUntil = normalizeDate(dto.accessUntil);
        const saved = await this.studentRepo.save(student);
        return this.toPublicStudent(saved);
    }
    async deleteAdmin(studentId) {
        const student = await this.studentRepo.findOne({ where: { id: studentId, isActive: true } });
        if (!student)
            throw new common_1.NotFoundException('Student not found');
        student.isActive = false;
        await this.studentRepo.save(student);
        return { ok: true };
    }
    async loginStudent(login, password) {
        const student = await this.studentRepo.findOne({ where: { login, isActive: true } });
        if (!student || !(await bcrypt.compare(password, student.passwordHash))) {
            throw new common_1.UnauthorizedException('Invalid login or password');
        }
        const payload = { sub: student.id, login: student.login, role: 'student', type: 'student' };
        return {
            accessToken: this.jwtService.sign(payload),
            student: this.toPublicStudent(student),
            accessActive: isAccessActive(student.accessUntil),
        };
    }
    async changePasswordStudent(studentId, currentPassword, newPassword) {
        const student = await this.studentRepo.findOne({ where: { id: studentId, isActive: true } });
        if (!student)
            throw new common_1.NotFoundException('Student not found');
        const currentOk = await bcrypt.compare(currentPassword, student.passwordHash);
        if (!currentOk)
            throw new common_1.UnauthorizedException('Current password is incorrect');
        student.passwordHash = await bcrypt.hash(newPassword, 10);
        await this.studentRepo.save(student);
        return { ok: true };
    }
    getStudentState(student) {
        return {
            student: this.toPublicStudent(student),
            accessActive: isAccessActive(student.accessUntil),
        };
    }
    requireAccess(student) {
        if (!isAccessActive(student.accessUntil)) {
            throw new common_1.ForbiddenException('Subscription expired');
        }
    }
    async getByIdOrThrow(studentId) {
        const student = await this.studentRepo.findOne({ where: { id: studentId, isActive: true } });
        if (!student)
            throw new common_1.NotFoundException('Student not found');
        return student;
    }
    toPublicStudent(student) {
        return {
            id: student.id,
            name: student.name,
            login: student.login,
            accessUntil: student.accessUntil,
            createdAt: student.createdAt,
            updatedAt: student.updatedAt,
        };
    }
};
exports.StudentService = StudentService;
exports.StudentService = StudentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(student_entity_1.StudentEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], StudentService);
function normalizeDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        throw new common_1.BadRequestException('Invalid date');
    }
    return date.toISOString().slice(0, 10);
}
function isAccessActive(accessUntil) {
    const now = new Date().toISOString().slice(0, 10);
    return accessUntil >= now;
}
//# sourceMappingURL=student.service.js.map