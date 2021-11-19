import React from 'react'
import { render, fireEvent, waitForElementToBeRemoved} from '@testing-library/react'
import { UserSignUpPage } from './UserSignUpPage'


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

        const mockAsyncDelay = () => {
            return jest.fn().mockImplementation(() => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve({});
                    }, 300)
                })
            })
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
        it('does not allow user to click the sign up button when there is an ongoing api call', () => {
            const actions = {
                postSignUp: mockAsyncDelay()
            }
            setUpForSubmit({actions})
            fireEvent.click(button)
            fireEvent.click(button)

            expect(actions.postSignUp).toHaveBeenCalledTimes(1)
        })
        it('displays spinner when there is an ongoing api call', () => {
            const actions = {
                postSignUp: mockAsyncDelay()
            }
            const {queryByText} = setUpForSubmit({actions})
            fireEvent.click(button)
            const spinner = queryByText('Loading...')
            expect(spinner).toBeInTheDocument()
        })
        it('hides spinner after api call finishes successfully', async () => {
            const actions = {
                postSignUp: mockAsyncDelay()
            }
            const { queryByText } = setUpForSubmit({ actions })
            fireEvent.click(button)
            await waitForElementToBeRemoved(() => queryByText('Loading...'), {timeout: 400})
            const spinner = queryByText('Loading...');
            expect(spinner).not.toBeInTheDocument()
        })
        it('hides spinner after api call finishes with error ', async () => {
            const actions = {
                postSignUp: jest.fn().mockImplementation(() => {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            reject({
                                response: { data: {}}
                            });
                        }, 300)
                    })
                })
            }
            const { queryByText } = setUpForSubmit({ actions })
            fireEvent.click(button)
            await waitForElementToBeRemoved(() => queryByText('Loading...'), {timeout: 400})
            const spinner = queryByText('Loading...');
            expect(spinner).not.toBeInTheDocument()
        })
        it('displays validation error for displayName when error is received for the field', async () => {
            const actions = {
                postSignUp: jest.fn().mockRejectedValue({
                  response: {
                    data: {
                      validationErrors: {
                        displayName: 'Cannot be null',
                      },
                    },
                  },
                }),
              };
            const { findByText } = setUpForSubmit({ actions });
            fireEvent.click(button);

            const errorMessage = await findByText('Cannot be null');
            expect(errorMessage).toBeInTheDocument();
        })
        it('enables the signup button when password and repeat password have same value', () => {
            setUpForSubmit();
            expect(button).not.toBeDisabled();
        })

        it('disables the signup button when password and repeat does not match password', () => {
            setUpForSubmit();
            fireEvent.change(passwordConfirm, changeEvent('new-pass'));
            expect(button).toBeDisabled();
        })

        it('disables the signup button when password does not match to password', () => {
            setUpForSubmit();
            fireEvent.change(passwordInput, changeEvent('new-pass'));
            expect(button).toBeDisabled();
        })

        it('Displays error style for password repeat input when password repeat mismatch', () => {
            const { queryByText } = setUpForSubmit();
            fireEvent.change(passwordConfirm, changeEvent('new-pass'));
            const mismatchWarning = queryByText('Passwords do not match');
            expect(mismatchWarning).toBeInTheDocument();
        })

        it('Displays error style for password repeat input when password input mismatch', () => {
            const { queryByText } = setUpForSubmit();
            fireEvent.change(passwordInput, changeEvent('new-pass'));
            const mismatchWarning = queryByText('Passwords do not match');
            expect(mismatchWarning).toBeInTheDocument();
        })

        it('hides the validation error when user changes the content of displayName', async () => {
            const actions = {
                postSignUp: jest.fn().mockRejectedValue({
                  response: {
                    data: {
                      validationErrors: {
                        displayName: 'Cannot be null',
                      },
                    },
                  },
                }),
              };
            const { queryByText, findByText } = setUpForSubmit({ actions });
            fireEvent.click(button);

            await findByText('Cannot be null');
            fireEvent.change(displayNameInput, changeEvent('name updated'));
            const errorMessage = queryByText('Cannot be null');
            expect(errorMessage).not.toBeInTheDocument();
        })

        it('hides the validation error when user changes the content of username', async () => {
            const actions = {
                postSignUp: jest.fn().mockRejectedValue({
                  response: {
                    data: {
                      validationErrors: {
                        username: 'Username cannot be null',
                      },
                    },
                  },
                }),
              };
            const { queryByText, findByText } = setUpForSubmit({ actions });
            fireEvent.click(button);

            await findByText('Username cannot be null');
            fireEvent.change(usernameInput, changeEvent('username updated'));
            const errorMessage = queryByText('Username cannot be null');
            expect(errorMessage).not.toBeInTheDocument();
        })

        it('hides the validation error when user changes the content of password', async () => {
            const actions = {
                postSignUp: jest.fn().mockRejectedValue({
                  response: {
                    data: {
                      validationErrors: {
                        password: 'Cannot be null',
                      },
                    },
                  },
                }),
              };
            const { queryByText, findByText } = setUpForSubmit({ actions });
            fireEvent.click(button);

            await findByText('Cannot be null');
            fireEvent.change(passwordInput, changeEvent('password-updated'));
            const errorMessage = queryByText('Cannot be null');
            expect(errorMessage).not.toBeInTheDocument();
        })
    })
})

console.error = () => {};