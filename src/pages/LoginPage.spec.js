import React from 'react'
import { render, fireEvent, waitForElementToBeRemoved } from '@testing-library/react'
import { LoginPage } from './LoginPage'

describe('LoginPage', () => {
    it('has header of Login', () => {
        const { container } = render(<LoginPage />);
        const header = container.querySelector('h1');
        expect(header).toHaveTextContent('Login');
    })

    it('has input for username', () => {
        const { queryByPlaceholderText } = render(<LoginPage />);
        const usernameInput = queryByPlaceholderText('Your username');
        expect(usernameInput).toBeInTheDocument();
    })

    it('has input for password', () => {
        const { queryByPlaceholderText } = render(<LoginPage />);
        const passwordInput = queryByPlaceholderText('Your password');
        expect(passwordInput).toBeInTheDocument();
    })

    it('has password type for password input', () => {
        const { queryByPlaceholderText } = render(<LoginPage />);
        const passwordInput = queryByPlaceholderText('Your password');
        expect(passwordInput.type).toBe("password");
    })

    it('has login button', () => {
        const { container } = render(<LoginPage />);
        const button = container.querySelector('button');
        expect(button).toBeInTheDocument();
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

        let usernameInput, passwordInput, button;

        const setupForSubmit = (props) => {
            const rendered = render(<LoginPage {...props} />)
            const { container, queryByPlaceholderText } = rendered;
            usernameInput = queryByPlaceholderText('Your username');
            fireEvent.change(usernameInput, changeEvent('my-user-name'));
            passwordInput = queryByPlaceholderText('Your password');
            fireEvent.change(passwordInput, changeEvent('P4ssword'));
            button = container.querySelector('button');
            return rendered;
        }

        it('sets the username value into state', () => {
            const { queryByPlaceholderText } = render(<LoginPage />);
            const usernameInput = queryByPlaceholderText('Your username');
            fireEvent.change(usernameInput, changeEvent('my-user-name'));
            expect(usernameInput).toHaveValue('my-user-name');
        })
        
        it('sets the password value into state', () => {
            const { queryByPlaceholderText } = render(<LoginPage />);
            const passwordInput = queryByPlaceholderText('Your password');
            fireEvent.change(passwordInput, changeEvent('P4ssword'));
            expect(passwordInput).toHaveValue('P4ssword');
        })

        it('calls postLogin with when the actions are provided in props and input fields have values', () => {
            const actions = {
                postLogin: jest.fn().mockResolvedValue({})
            }
            setupForSubmit({ actions })
            fireEvent.click(button);
            expect(actions.postLogin).toHaveBeenCalledTimes(1);
        })

        it('does not thrown exception when clicking the button when action not provided in props', () => {
            setupForSubmit();
            expect(() => fireEvent.click(button)).not.toThrow();
        })

        it('calls postLogin with credentials in body', () => {
            const actions = {
                postLogin: jest.fn().mockResolvedValue({})
            }
            setupForSubmit({ actions })
            fireEvent.click(button);
            const expectedUserObject = {
                username: 'my-user-name',
                password: 'P4ssword'
            }
            expect(actions.postLogin).toHaveBeenCalledWith(expectedUserObject);
        })

        it('enables the button when username and password is not empty', () => {
            setupForSubmit();
            expect(button).not.toBeDisabled();
        })
        it('disable the button when username is empty', () => {
            setupForSubmit();
            fireEvent.change(usernameInput, changeEvent(''));
            expect(button).toBeDisabled();
        })
        it('disable the button when username is empty', () => {
            setupForSubmit();
            fireEvent.change(passwordInput, changeEvent(''));
            expect(button).toBeDisabled();
        })
        it('display alert when login fails', async () => {
            const actions = {
                postLogin: jest.fn().mockRejectedValue({
                    response: {
                        data: {
                            message: 'Login failed'
                        }
                    }
                })
            }
            const { findByText } = setupForSubmit({ actions });
            fireEvent.click(button);
    
            const alert = await findByText('Login failed');
            expect(alert).toBeInTheDocument();
        })

        it('clears alert when user clears username', async () => {
            const actions = {
                postLogin: jest.fn().mockRejectedValue({
                    response: {
                        data: {
                            message: 'Login failed'
                        }
                    }
                })
            }
            const { findByText } = setupForSubmit({ actions })
            fireEvent.click(button);

            const alert = await findByText('Login failed');
            fireEvent.change(usernameInput, changeEvent('updated-username'));
            expect(alert).not.toBeInTheDocument();
        })

        it('clears alert when user clears password', async () => {
            const actions = {
                postLogin: jest.fn().mockRejectedValue({
                    response: {
                        data: {
                            message: 'Login failed'
                        }
                    }
                })
            }
            const { findByText } = setupForSubmit({ actions });
            fireEvent.click(button);

            const alert = await findByText('Login failed');
            fireEvent.change(passwordInput, changeEvent('updated-password'));
            expect(alert).not.toBeInTheDocument();
        })

        it('does not allow user to click the login button when there is an ongoing api call', () => {
            const actions = {
                postLogin: mockAsyncDelay()
            }
            setupForSubmit({actions})
            fireEvent.click(button)
            fireEvent.click(button)

            expect(actions.postLogin).toHaveBeenCalledTimes(1)
        })

        it('displays spinner when there is an ongoing api call', () => {
            const actions = {
                postLogin: mockAsyncDelay()
            }
            const {queryByText} = setupForSubmit({actions})
            fireEvent.click(button)
            const spinner = queryByText('Loading...')
            expect(spinner).toBeInTheDocument()
        })

        it('hides spinner after api call finishes successfully', async () => {
            const actions = {
                postLogin: mockAsyncDelay()
            }
            const { queryByText } = setupForSubmit({ actions })
            fireEvent.click(button)
            await waitForElementToBeRemoved(() => queryByText('Loading...'), {timeout: 400})
            const spinner = queryByText('Loading...');
            expect(spinner).not.toBeInTheDocument()
        })

        it('hides spinner after api call finishes with error ', async () => {
            const actions = {
                postLogin: jest.fn().mockImplementation(() => {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            reject({
                                response: { data: {}}
                            });
                        }, 300)
                    })
                })
            }
            const { queryByText } = setupForSubmit({ actions })
            fireEvent.click(button)
            await waitForElementToBeRemoved(() => queryByText('Loading...'), {timeout: 400})
            const spinner = queryByText('Loading...');
            expect(spinner).not.toBeInTheDocument()
        })
    })
})

console.error = () => {};