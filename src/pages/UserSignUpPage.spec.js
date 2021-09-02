import React from 'react'
import { render, cleanup, fireEvent } from '@testing-library/react'
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
    describe('Interactions', () => {
        const changeEvent = (content) => {
            return {
                target: {
                    value: content
                }
            }
        }

        let button, displayNameInput, usernameInput, passwordInput, passwordConfirm;

        const setUpForSubmit = (props) => {
            const rendered = render(<UserSignUpPage {...props} />);
            const {container, queryByPlaceholderText} = rendered;
            
            displayNameInput = queryByPlaceholderText('Your display name');
            usernameInput = queryByPlaceholderText('Your username');
            passwordInput = queryByPlaceholderText('Your password'); 
            passwordConfirm = queryByPlaceholderText('Confirm your password');

            fireEvent.change(displayNameInput, changeEvent('my-display-name'));
            fireEvent.change(usernameInput, changeEvent('my-username-name'));
            fireEvent.change(passwordInput, changeEvent('P4ssword'));
            fireEvent.change(passwordConfirm, changeEvent('P4ssword'));

            button = container.querySelector('button');
            return rendered
        }

        it('set the displayName value into state', () => {
            const { queryByPlaceholderText } = render(<UserSignUpPage />);
            const displayNameInput = queryByPlaceholderText('Your display name');
            fireEvent.change(displayNameInput, changeEvent('my-display-name'));
            expect(displayNameInput).toHaveValue('my-display-name');
        })
        it('set the username value into state', () => {
            const { queryByPlaceholderText } = render(<UserSignUpPage />);
            const usernameInput = queryByPlaceholderText('Your username');
            fireEvent.change(usernameInput, changeEvent('my-username-name'));
            expect(usernameInput).toHaveValue('my-username-name');
        })
        it('set the password value into state', () => {
            const { queryByPlaceholderText } = render(<UserSignUpPage />);
            const passwordInput = queryByPlaceholderText('Your password');
            fireEvent.change(passwordInput, changeEvent('P4ssword'));
            expect(passwordInput).toHaveValue('P4ssword');
        })
        it('set the confirm password value into state', () => {
            const { queryByPlaceholderText } = render(<UserSignUpPage />)
            const passwordConfirm = queryByPlaceholderText('Confirm your password');
            fireEvent.change(passwordConfirm, changeEvent('P4ssword'));
            expect(passwordConfirm).toHaveValue('P4ssword');
        })

        it('calls postSignup when the field are valid and the actions are provided in props', () => {
            const actions = {
                postSignUp: jest.fn().mockResolvedValueOnce({})
            }
            setUpForSubmit({actions})
            fireEvent.click(button)
            expect(actions.postSignUp).toHaveBeenCalledTimes(1);
        })

        it('does not throw exception when clicking the button when actions not provided in props', () => {
            setUpForSubmit()
            expect(() => fireEvent.click(button)).not.toThrow();
        })
        
        it('calls post with user body when the fields are valid', () => {
            const actions = {
                postSignUp: jest.fn().mockResolvedValueOnce({})
            }
            setUpForSubmit({actions})
            fireEvent.click(button)
            const expectedUserObject = {
                username: 'my-username-name',
                displayName: 'my-display-name',
                password: 'P4ssword',
            }
            expect(actions.postSignUp).toHaveBeenCalledWith(expectedUserObject)
        })
    })
})