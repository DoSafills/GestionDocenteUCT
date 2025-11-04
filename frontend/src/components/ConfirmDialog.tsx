import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from '@components/ui/alert-dialog';

import { buttonVariants } from './ui/button';
import { cn } from './ui/utils';
import type { ReactNode } from 'react';

interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    onConfirm: () => void;
    title?: string | ReactNode;
    description?: string | ReactNode;
    confirmText?: string | ReactNode;
    cancelText?: string | ReactNode;
    variant?: 'default' | 'destructive';
}

export function ConfirmDialog({
    open,
    onOpenChange,
    onConfirm,
    title = 'Confirmar acción',
    description = '¿Estás seguro de realizar esta acción?',
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    variant = 'default',
}: ConfirmDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{cancelText}</AlertDialogCancel>
                    <AlertDialogAction className={cn(buttonVariants({ variant: variant }))} onClick={onConfirm}>
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
