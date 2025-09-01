"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@radix-ui/react-tabs";
import { Calendar, FileText, MapPin, Plus } from "lucide-react";
import { EmptyState } from "./empty-state";
import { Estimate, ESTIMATE_STATUSES } from "@/types/estimates";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { currencyCharacter, Customer } from "@/types/database";
import { InfoEstimate } from "@/components/estimates/info-estimate";
import { wait } from "@/utils/promise";
import { EditEstimateForm } from "@/components/estimates/edit-estimate-form";
import DeleteEstimateForm from "@/components/estimates/delete-estimate-form";
import ApproveEstimateForm from "@/components/estimates/approve-estimate-form";

import { Loader } from "@/components/ui/loader";
import { AddEstimateForm } from "@/components/estimates/add-estimate-form";
type EstimateTabProps = {
  customer: Customer;
  estimates: Estimate[] | null | undefined;
  mutate: () => void;
  isValidating: boolean;
};
export default function EstimateTab({
  customer,
  estimates,
  mutate,
  isValidating,
}: EstimateTabProps) {
  const [isInfoEstimateShown, setIsInfoEstimateShown] = useState<
    Estimate | false
  >(false);
  const [isAddEstimateOpen, setIsAddEstimateOpen] = useState<Customer | false>(
    false
  );
  const [isEditEstimateOpen, setIsEditEstimateOpen] = useState<
    Estimate | false
  >(false);
  const [isDeleteEstimateOpen, setIsDeleteEstimateOpen] = useState<
    Estimate | false
  >(false);

  const [isApproveEstimateOpen, setIsApproveEstimateOpen] = useState<
    Estimate | false
  >(false);
  const getStatusBadge = (status: string) => {
    const statusConfig = ESTIMATE_STATUSES.find((s) => s.value === status);
    if (!statusConfig) return <Badge variant="secondary">{status}</Badge>;

    return (
      <Badge variant="secondary" className={statusConfig.color + " text-xs"}>
        {statusConfig.label}
      </Badge>
    );
  };
  const reversedEstimate = estimates ? [...estimates].reverse() : [];

  return (
    <>
      {" "}
      {isAddEstimateOpen && (
        <AddEstimateForm
          customer={isAddEstimateOpen}
          open={!!isAddEstimateOpen}
          onOpenChange={() => setIsAddEstimateOpen(false)}
          onSuccess={() => {
            setIsAddEstimateOpen(false);
            mutate();
          }}
        />
      )}
      {isInfoEstimateShown && (
        <InfoEstimate
          estimate={isInfoEstimateShown}
          open={!!isInfoEstimateShown}
          setIsApproveEstimateOpen={setIsApproveEstimateOpen}
          setIsEditEstimateOpen={setIsEditEstimateOpen}
          setIsDeleteEstimateOpen={setIsDeleteEstimateOpen}
          onOpenChange={() => setIsInfoEstimateShown(false)}
          onButtonsClick={async (setModalOpen, value) => {
            setIsInfoEstimateShown(false);
            await wait(200);
            setModalOpen(value);
          }}
        />
      )}
      {isEditEstimateOpen && (
        <EditEstimateForm
          estimate={isEditEstimateOpen}
          open={!!isEditEstimateOpen}
          onOpenChange={() => setIsEditEstimateOpen(false)}
          onSuccess={() => {
            setIsEditEstimateOpen(false);
            mutate();
          }}
        />
      )}
      {isDeleteEstimateOpen && (
        <DeleteEstimateForm
          estimate={isDeleteEstimateOpen}
          open={!!isDeleteEstimateOpen}
          onOpenChange={() => setIsDeleteEstimateOpen(false)}
          onSuccess={() => {
            setIsDeleteEstimateOpen(false);
            setIsInfoEstimateShown(false);
            mutate()
          }}
        />
      )}
      {isApproveEstimateOpen && (
        <ApproveEstimateForm
          estimate={isApproveEstimateOpen}
          open={!!isApproveEstimateOpen}
          onOpenChange={() => setIsApproveEstimateOpen(false)}
          onSuccess={() => {
            setIsApproveEstimateOpen(false);
            setIsInfoEstimateShown(false);
            mutate();
          }}
        />
      )}
      <TabsContent
        value="estimates"
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
            <h2 className="text-xl font-semibold text-gray-900">Estimates</h2>
            <p className="text-sm text-gray-500 mt-1">
              View and manage all estimates and quotes
            </p>
          </div>
          <Button onClick={() => setIsAddEstimateOpen(customer)} size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Create Estimate
          </Button>
        </div>

        <Card>
          <CardContent className="min-h-75 flex flex-col gap-3">
            {reversedEstimate?.map((estimate) => (
              <div
                key={estimate.id}
                onClick={() => setIsInfoEstimateShown(estimate)}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {estimate.job_name}
                      </h4>
                      {getStatusBadge(estimate.status)}
                    </div>

                    <div className="mt-2 mb-3">
                      <p className="text-xs font-medium text-gray-700 mb-1">
                        Tasks:
                      </p>
                      <div className="space-y-1 mr-5">
                        {estimate.tasks.map((task, index) => (
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

                        {estimate.site_address ||
                          estimate.customer.property_address}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Created:{" "}
                        {new Date(estimate.created_at).toLocaleDateString(
                          undefined
                        )}
                      </span>
                    </div>

                    {estimate.notes && (
                      <p className="text-xs text-gray-500 mt-2 italic">
                        Note: {estimate.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 ">
                    <span className="text-lg font-bold text-gray-900">
                      {currencyCharacter}
                      {Number(estimate.tasks_total_price).toLocaleString(
                        undefined
                      )}
                    </span>
                    <span className="text-sm font-medium">
                      {" "}
                      EST-{estimate.id}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {reversedEstimate.length === 0 && (
              <div>
                <EmptyState
                  icon={FileText}
                  title="No estimates yet"
                  description="Create estimates to provide quotes for your customer's projects."
                  action={{
                    label: "Create Estimate",
                    onClick: () => setIsAddEstimateOpen(customer),
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
