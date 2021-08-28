import React from 'react'
import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { SampleClass } from './Sample'

beforeEach(cleanup);

describe('Test sample page', () => {

    describe('See if there are elements on the page', () => {
        it('h1 element on page', () => {
            const { container } = render(<SampleClass />);
            const element = container.querySelector('h1');
            expect(element).toHaveTextContent('Sample Page');
        })
        it('add submit button', () => {
            const { container } = render(<SampleClass />);
            const button = container.querySelector('button');
            expect(button).toBeInTheDocument;
            expect(button).toHaveTextContent('Submit');
        })
    })

})