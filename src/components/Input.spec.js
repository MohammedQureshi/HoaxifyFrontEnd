import React from 'react'
import { render} from '@testing-library/react'
import Input from './Input'

describe('Layout', () => {
    it('has input item', () => {
        const { container } = render(<Input />);
        const input = container.querySelector('input');
        expect(input).toBeInTheDocument();
    })
    it('displays the label provided in props', () => {
        const { queryByText } = render(<Input label="Test label" />);
        const label = queryByText('Test label');
        expect(label).toBeInTheDocument();
    })
    it('does not displays the label when no label provided in props', () => {
        const { container } = render(<Input />);
        const label = container.querySelector('label');
        expect(label).not.toBeInTheDocument();
    })
    it('has text type for input whgen type is not provided as prop', () => {
        const { container } = render(<Input />);
        const input = container.querySelector('input');
        expect(input.type).toBe('text')
    })
    it('has password type for input whgen type is not provided as prop', () => {
        const { container } = render(<Input type="password" />);
        const input = container.querySelector('input');
        expect(input.type).toBe('password')
    })
    it('displays placeholder when it is provided as prop', () => {
        const { container } = render(<Input placeholder="Test placeholder" />);
        const input = container.querySelector('input');
        expect(input.placeholder).toBe('Test placeholder')
    })
})