import React from 'react'
import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { UserSignUpPage } from './UserSignUpPage'

beforeEach(cleanup);

describe('UserSignUpPage', () => {
    describe('Layout', () => {
        it('has header of Sign Up', () => {
            const { container } = render(<UserSignUpPage />);
            const header = container.querySelector('h1');
            expect(header).toHaveTextContent('Sign Up');
        });
        it('has input for display name', () => {
            const { queryByPlaceholderText } = render(<UserSignUpPage />);
            const displayNameInput = queryByPlaceholderText('Your display name');
            expect(displayNameInput).toBeInTheDocument();
        });
        it('has input for username', () => {
            const { queryByPlaceholderText } = render(<UserSignUpPage />);
            const usernameInput = queryByPlaceholderText('Your username');
            expect(usernameInput).toBeInTheDocument();
        });
        it('has password input', () => {
            const { queryByPlaceholderText } = render(<UserSignUpPage />);
            const passwordInput = queryByPlaceholderText('Your password');
            expect(passwordInput).toBeInTheDocument();
        });
        it('has password type for password input', () => {
            const { queryByPlaceholderText } = render(<UserSignUpPage />);
            const passwordInput = queryByPlaceholderText('Your password');
            expect(passwordInput.type).toBe('password');
        });
        it('has confirm password input', () => {
            const { queryByPlaceholderText } = render(<UserSignUpPage />);
            const passwordConfirm = queryByPlaceholderText('Confirm your password');
            expect(passwordConfirm).toBeInTheDocument();
        });
        it('has password type for password repeat input', () => {
            const { queryByPlaceholderText } = render(<UserSignUpPage />);
            const passwordConfirm = queryByPlaceholderText('Confirm your password');
            expect(passwordConfirm.type).toBe('password');
        })
        it('has submit button', () => {
            const { container } = render(<UserSignUpPage />);
            const button = container.querySelector('button');
            expect(button).toBeInTheDocument();
        })
    })
})