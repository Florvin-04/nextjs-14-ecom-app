"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function AdminSidebar() {
  return (
    <aside className="h-full border-r">
      <div className="h-10 flex items-center justify-center">
        <p>ADMIN</p>
      </div>
      <hr />
      <div className="px-2 mt-3">
        <Accordion type="multiple" className="w-full">
          <AccordionItem className="border-none" value="item-1">
            <AccordionTrigger className="hover:no-underline hover:bg-accent hover:text-accent-foreground px-2 rounded-md border-none text-[1.2rem] font-semibold">
              Product
            </AccordionTrigger>
            <AccordionContent>
              <Button asChild className="w-full justify-start" variant="ghost">
                <Link href="/admin/products">Product List</Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="ghost">
                <Link href="/admin/orders">Oders</Link>
              </Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </aside>
  );
}
