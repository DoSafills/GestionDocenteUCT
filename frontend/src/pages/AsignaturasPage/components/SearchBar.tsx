import { Input } from '@components/ui/input';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
    return (
        <div className='mb-4'>
            <Input
                type='text'
                placeholder='Buscar asignatura por nombre o código...'
                onChange={(e) => onSearch(e.target.value)}
            />
        </div>
    );
}
