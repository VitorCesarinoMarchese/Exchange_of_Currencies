export interface deal {
  properties: {
    amount?: string;
    usd_amount?: Number;
    gbp_amount?: Number;
    closedate: string;
    dealname: string;
    pipeline: string;
    dealstage: string;
  };
  associations: [
    {
      to: { id: string };
      types: [{ associationCategory: "HUBSPOT_DEFINED"; associationTypeId: 3 }];
    }
  ];
}
