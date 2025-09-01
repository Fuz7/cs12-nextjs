"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@radix-ui/react-tabs";
import { Calendar, FileText, MapPin, Plus } from "lucide-react";
import { EmptyState } from "./empty-state";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { wait } from "@/utils/promise";

import { Loader } from "@/components/ui/loader";
import { Invoice, INVOICE_STATUSES } from "@/types/invoices";
import { currencyCharacter, Customer } from "@/types/database";
import { AddInvoiceForm } from "@/components/invoices/add-invoice-form";
import { InfoInvoice } from "@/components/invoices/info-invoice";
import { EditInvoiceForm } from "@/components/invoices/edit-invoice-form";
import DeleteInvoiceForm from "@/components/invoices/delete-invoice-form";

type InvoiceTabProps = {
  customer: Customer;
  invoices: Invoice[] | null | undefined;
  mutate: () => void;
  isValidating: boolean;
};

export default function InvoiceTab({
  customer,
  invoices,
  mutate,
  isValidating,
}: InvoiceTabProps) {
  const [isInfoInvoiceShown, setIsInfoInvoiceShown] = useState<Invoice | false>(
    false
  );
  const [isAddInvoiceOpen, setIsAddInvoiceOpen] = useState<Customer | false>(
    false
  );
  const [isEditInvoiceOpen, setIsEditInvoiceOpen] = useState<Invoice | false>(
    false
  );
  const [isDeleteInvoiceOpen, setIsDeleteInvoiceOpen] = useState<
    Invoice | false
  >(false);

  const getStatusBadge = (status: string) => {
    const statusConfig = INVOICE_STATUSES.find((s) => s.value === status);
    if (!statusConfig) return <Badge variant="secondary">{status}</Badge>;

    return (
      <Badge variant="secondary" className={statusConfig.color + " text-xs"}>
        {statusConfig.label}
      </Badge>
    );
  };
  const reversedInvoice = invoices ? [...invoices].reverse() : [];

  return (
    <>
      {" "}
      {isAddInvoiceOpen && (
        <AddInvoiceForm
          customer={isAddInvoiceOpen}
          open={!!isAddInvoiceOpen}
          onOpenChange={() => setIsAddInvoiceOpen(false)}
          onSuccess={() => {
            setIsAddInvoiceOpen(false);
            mutate();
          }}
        />
      )}
      {isInfoInvoiceShown && (
        <InfoInvoice
          invoice={isInfoInvoiceShown}
          open={!!isInfoInvoiceShown}
          setIsEditInvoiceOpen={setIsEditInvoiceOpen}
          setIsDeleteInvoiceOpen={setIsDeleteInvoiceOpen}
          onOpenChange={() => setIsInfoInvoiceShown(false)}
          onButtonsClick={async (setModalOpen, value) => {
            setIsInfoInvoiceShown(false);
            await wait(200);
            setModalOpen(value);
          }}
        />
      )}
      {isEditInvoiceOpen && (
        <EditInvoiceForm
          invoice={isEditInvoiceOpen}
          open={!!isEditInvoiceOpen}
          onOpenChange={() => setIsEditInvoiceOpen(false)}
          onSuccess={() => {
            setIsEditInvoiceOpen(false);
            mutate();
          }}
        />
      )}
      {isDeleteInvoiceOpen && (
        <DeleteInvoiceForm
          invoice={isDeleteInvoiceOpen}
          open={!!isDeleteInvoiceOpen}
          onOpenChange={() => setIsDeleteInvoiceOpen(false)}
          onSuccess={() => {
            setIsDeleteInvoiceOpen(false);
            setIsInfoInvoiceShown(false);
            mutate()
          }}
        />
      )}
      <TabsContent
        value="invoices"
        className="flex-1 p-6 space-y-6 overflow-y-auto"
      >
        {isValidating && (
          <div
            className=" absolute inset-0 top-20 pb-30 flex items-center justify-center 
          backdrop-blur-sm min-h-[calc(100%-80px)]"
          >
            <Loader variant="spinner" size="xl" className="" />
          </div>
        )}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Invoices</h2>
            <p className="text-sm text-gray-500 mt-1">
              View and manage all invoices and quotes
            </p>
          </div>
          <Button onClick={() => setIsAddInvoiceOpen(customer)} size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        </div>

        <Card>
          <CardContent className="min-h-75 flex flex-col gap-3">
            {reversedInvoice?.map((invoice) => (
              <div
                key={invoice.id}
                onClick={() => setIsInfoInvoiceShown(invoice)}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {invoice.job_name}
                      </h4>
                      {getStatusBadge(invoice.status)}
                    </div>

                    <div className="mt-2 mb-3">
                      <p className="text-xs font-medium text-gray-700 mb-1">
                        Tasks:
                      </p>
                      <div className="space-y-1 mr-5">
                        {invoice.tasks &&
                          invoice?.tasks?.map((task, index) => (
                            <div
                              key={index}
                              className="flex justify-between text-xs text-gray-600"
                            >
                              <span>• {task.description}</span>
                              <span>
                                {currencyCharacter}
                                {task.price.toLocaleString(undefined)}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />

                        {invoice.site_address ||
                          invoice.customer.property_address}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Created:{" "}
                        {new Date(invoice.created_at).toLocaleDateString(
                          undefined
                        )}
                      </span>
                    </div>

                    {invoice.notes && (
                      <p className="text-xs text-gray-500 mt-2 italic">
                        Note: {invoice.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 ">
                    <span className="text-lg font-bold text-gray-900">
                      {currencyCharacter}
                      {Number(invoice.tasks_total_price).toLocaleString(
                        undefined
                      )}
                    </span>

                    <div className="text-right">
                      {/* Due / Paid */}
                      <div className="text-right">
                        {/* Due Amount */}
                        <span
                          className={`text-sm font-medium ${
                            Number(invoice.paid_amount) >=
                            Number(invoice.tasks_total_price)
                              ? "text-green-600" // fully paid
                              : Number(invoice.paid_amount) === 0
                              ? "text-red-600" // nothing paid yet
                              : "text-orange-600" // partially paid
                          }`}
                        >
                          Due: ₱
                          {Math.max(
                            Number(invoice.tasks_total_price) -
                              Number(invoice.paid_amount),
                            0
                          ).toLocaleString()}
                        </span>

                        {/* Paid Amount (only show if > 0 and not fully paid) */}
                        {Number(invoice.paid_amount) > 0 &&
                          Number(invoice.paid_amount) <
                            Number(invoice.tasks_total_price) && (
                            <p className="text-xs text-gray-500">
                              Paid: ₱
                              {Number(invoice.paid_amount).toLocaleString()}
                            </p>
                          )}
                      </div>

                      {/* Invoice ID */}
                      <span className="text-md font-medium ">
                        INV-{invoice.id}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {reversedInvoice.length === 0 && (
              <div>
                <EmptyState
                  icon={FileText}
                  title="No invoices yet"
                  description="Create invoices to provide quotes for your customer's projects."
                  action={{
                    label: "Create Invoice",
                    onClick: () => setIsAddInvoiceOpen(customer),
                    icon: Plus,
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </>
  );
}
