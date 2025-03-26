export interface filter {
  filterGroups: [
    {
      filters: [
        {
          propertyName: "email";
          operator: "EQ";
          value: string;
        }
      ];
    }
  ];
}
