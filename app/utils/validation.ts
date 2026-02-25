// Validation utilities

export interface ValidationErrors {
  [key: string]: string;
}

export const validateEmail = (email: string): string | null => {
  if (!email) return 'Email là bắt buộc';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Email không hợp lệ';
  if (email.length > 100) return 'Email quá dài';
  return null;
};

export const validatePassword = (password: string, isRegister = false): string | null => {
  if (!password) return 'Mật khẩu là bắt buộc';
  if (password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự';
  if (isRegister && password.length > 50) return 'Mật khẩu quá dài';
  return null;
};

export const validateName = (name: string): string | null => {
  if (!name || !name.trim()) return 'Tên là bắt buộc';
  if (name.trim().length < 2) return 'Tên phải có ít nhất 2 ký tự';
  if (name.trim().length > 50) return 'Tên quá dài';
  if (!/^[\p{L}\s]+$/u.test(name.trim())) return 'Tên chỉ được chứa chữ cái và khoảng trắng';
  return null;
};

export const validateAge = (age: string | number): string | null => {
  const ageNum = typeof age === 'string' ? parseInt(age) : age;
  if (!age || isNaN(ageNum)) return 'Tuổi là bắt buộc';
  if (ageNum < 18) return 'Bạn phải từ 18 tuổi trở lên';
  if (ageNum > 100) return 'Tuổi không hợp lệ';
  return null;
};

export const validateBio = (bio: string): string | null => {
  if (bio && bio.length > 500) return 'Bio không được vượt quá 500 ký tự';
  return null;
};

export const validateTimeRange = (startTime: string, endTime: string): string | null => {
  if (!startTime || !endTime) return 'Vui lòng chọn đầy đủ giờ';
  if (startTime >= endTime) return 'Giờ bắt đầu phải trước giờ kết thúc';
  
  // Check if time range is at least 30 minutes
  const start = new Date(`2000-01-01 ${startTime}`);
  const end = new Date(`2000-01-01 ${endTime}`);
  const diff = (end.getTime() - start.getTime()) / (1000 * 60);
  if (diff < 30) return 'Thời gian rảnh phải ít nhất 30 phút';
  
  return null;
};

// Validate register form
export const validateRegisterForm = (data: {
  name: string;
  email: string;
  password: string;
  age: string;
  gender: string;
  bio: string;
}): ValidationErrors => {
  const errors: ValidationErrors = {};

  const nameError = validateName(data.name);
  if (nameError) errors.name = nameError;

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(data.password, true);
  if (passwordError) errors.password = passwordError;

  const ageError = validateAge(data.age);
  if (ageError) errors.age = ageError;

  const bioError = validateBio(data.bio);
  if (bioError) errors.bio = bioError;

  return errors;
};

// Validate login form
export const validateLoginForm = (data: {
  email: string;
  password: string;
}): ValidationErrors => {
  const errors: ValidationErrors = {};

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;

  return errors;
};

// Validate availability form
export const validateAvailabilityForm = (data: {
  date: string;
  startTime: string;
  endTime: string;
}): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.date) errors.date = 'Vui lòng chọn ngày';
  
  const timeError = validateTimeRange(data.startTime, data.endTime);
  if (timeError) {
    errors.startTime = timeError;
    errors.endTime = timeError;
  }

  return errors;
};
