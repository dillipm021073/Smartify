import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ReviewSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

interface ReviewItemProps {
  label: string;
  value: string | React.ReactNode;
}

export function ReviewItem({ label, value }: ReviewItemProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-2">
      <dt className="text-sm font-medium text-muted-foreground sm:w-40 flex-shrink-0">
        {label}
      </dt>
      <dd className="text-sm text-foreground flex-1">{value}</dd>
    </div>
  );
}

export default function ReviewSection({ title, children, defaultOpen }: ReviewSectionProps) {
  return (
    <Accordion type="single" collapsible defaultValue={defaultOpen ? "item-1" : undefined}>
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-lg font-semibold hover:no-underline">
          {title}
        </AccordionTrigger>
        <AccordionContent>
          <dl className="divide-y divide-border">
            {children}
          </dl>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
