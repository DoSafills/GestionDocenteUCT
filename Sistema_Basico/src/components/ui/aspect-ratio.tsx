"use client";

import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

function AspectRatio({
  children,
  ...props
}: React.ComponentProps<typeof AspectRatioPrimitive.Root>) {
  return (
    <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props}>
      <div className="text-black"> {/* Aquí puedes agregar texto con clase "text-black" */}
        {children}
      </div>
    </AspectRatioPrimitive.Root>
  );
}

export { AspectRatio };
