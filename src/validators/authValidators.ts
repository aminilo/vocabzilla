import { body } from 'express-validator';

export const registerValidator = [
	body('username').optional().trim().isLength({ min: 2, max: 20 }),

	body('email')
		.trim()
		.notEmpty().withMessage('Email is required')
		.isEmail().withMessage('Invalid email address'),

	body('password')
		.trim()
		.notEmpty().withMessage('Password is required')
		.isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
		.matches(/[A-Z]/).withMessage('Password must have at least one uppercase letter')
		.matches(/[a-z]/).withMessage('Password must have at least one lowercase letter')
		.matches(/\d/).withMessage('Password must have at least one number')
];

export const loginValidator = [
	body('email')
		.trim()
		.notEmpty().withMessage('Email is required')
		.isEmail().withMessage('Invalid email address'),

	body('password').trim().notEmpty().withMessage('Password is required')
];

export const profileValidator = [
	body('username')
		.optional({ checkFalsy: true })
		.trim()
		.notEmpty().withMessage('Username cannot be empty')
		.bail()
		.isLength({ min: 2, max: 20 }).withMessage('Username must be between 2 and 20 characters'),

	body('password')
		.if(body('password').not().isEmpty())
		.trim()
		.isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
		.bail()
		.matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
		.matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
		.matches(/\d/).withMessage('Password must contain at least one number'),

	body('currentPassword')
		.if(body('password').not().isEmpty())
		.trim().notEmpty().withMessage('Current Password cannot be empty')
];

export const forgotPasswordValidator = [
	body('email').trim().notEmpty().withMessage('Email is required')
];

export const resetPasswordValidator = [
	body('password')
		.trim()
		.notEmpty().withMessage('Password is required')
		.isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
		.matches(/[A-Z]/).withMessage('Password must have at least one uppercase letter')
		.matches(/[a-z]/).withMessage('Password must have at least one lowercase letter')
		.matches(/\d/).withMessage('Password must have at least one number')
];
