import { useState, ChangeEvent } from 'react';
import { Input } from '@components/ui/input'; // Ajusta la ruta si es diferente

interface SearchBarProps {
    onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
    const [query, setQuery] = useState('');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        onSearch(value);
    };

    return (
        <div className='mb-4'>
            <Input
                type='text'
                placeholder='Buscar asignatura por nombre o código...'
                value={query}
                onChange={handleChange}
            />
        </div>
    );
}
