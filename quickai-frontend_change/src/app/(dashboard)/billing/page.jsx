import BillingPlans from "@/components/features/billing/billing-plans";

export default function BillingPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="mb-4   pb-3 text-[37px] font-bold text-[#0088FF]">
          Pricing Plans
        </h1>
        <p className="text-muted-foreground text-lg">
          Simple, transparent pricing for every AI creator.
        </p>
      </div>

      {/* The Feature Component */}
      <BillingPlans />

      {/* Footer note */}
      <p className="text-center text-muted-foreground text-sm pt-8">
        * All plans include access to upcoming Quick AI tools and improvements.
      </p>
    </div>
  );
}