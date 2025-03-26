import { deal } from "../models/deal";
import { filter } from "../models/filter";
import { postContact, postDeal, getContact } from "../utils/hubSpot";
import dotenv from "dotenv";
dotenv.config();

describe("HubSpot API functions", () => {
  beforeEach(() => {
    process.env.URL_HUBSPOT = "http://dummyapi.com/";
    process.env.API_KEY_HUBSPOT = "dummyapikey";
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe("Post Contact", () => {
    it("should send a POST request and return response", async () => {
      const body = {
        properties: {
          email: "test@test.com",
          firstname: "test",
          lastname: "test",
          phone: "",
          company: "string",
        },
      };
      const mockData = {
        id: "108720619322",
        properties: {
          company: "Test",
          createdate: "2025-03-25T12:34:09.412Z",
          email: "test@tester2.com",
          firstname: "Test",
          hs_all_contact_vids: "108720619322",
          hs_associated_target_accounts: "0",
          hs_currently_enrolled_in_prospecting_agent: "false",
          hs_email_domain: "tester2.com",
          hs_full_name_or_email: "Test",
          hs_is_contact: "true",
          hs_is_unworked: "true",
          hs_lifecyclestage_lead_date: "2025-03-25T12:34:09.412Z",
          hs_membership_has_accessed_private_content: "0",
          hs_object_id: "108720619322",
          hs_object_source: "INTEGRATION",
          hs_object_source_id: "9892307",
          hs_object_source_label: "INTEGRATION",
          hs_pipeline: "contacts-lifecycle-pipeline",
          hs_prospecting_agent_actively_enrolled_count: "0",
          hs_registered_member: "0",
          hs_searchable_calculated_phone_number: "1234567890",
          hs_sequences_actively_enrolled_count: "0",
          lastmodifieddate: "2025-03-25T12:34:09.412Z",
          lastname: null,
          lifecyclestage: "lead",
          num_notes: "0",
          phone: "+1234567890",
        },
        createdAt: "2025-03-25T12:34:09.412Z",
        updatedAt: "2025-03-25T12:34:09.412Z",
        archived: false,
      };
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockData),
      });
      const response = await postContact(body);
      const rjson = await response.json();
      expect(rjson).toEqual(mockData);
      expect(response.ok).toBe(true);
    });
    it("should throw an error on failed request", async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: jest.fn().mockResolvedValueOnce({ message: "Error" }),
      });
      const body = {
        properties: {
          email: "",
          firstname: "",
          lastname: "",
          phone: "",
          company: "",
        },
      };
      await expect(postContact(body)).rejects.toThrow("Error fetching api");
    });
  });

  describe("Post Deal", () => {
    it("should send a POST request and return response", async () => {
      const mockData = {
        id: "35040491681",
        properties: {
          amount: "1500.00",
          amount_in_home_currency: "1500.00",
          closedate: "2019-12-07T16:50:06.678Z",
          createdate: "2025-03-25T11:45:08.852Z",
          days_to_close: "0",
          dealname: "New deal",
          dealstage: "contractsent",
          hs_closed_amount: "0",
          hs_closed_amount_in_home_currency: "0",
          hs_closed_deal_close_date: "0",
          hs_closed_deal_create_date: "0",
          hs_closed_won_count: "0",
          hs_createdate: "2025-03-25T11:45:08.852Z",
          hs_days_to_close_raw: "0",
          hs_deal_stage_probability_shadow: 0.9,
          hs_forecast_amount: "1500.00",
          hs_is_closed: false,
          hs_is_closed_count: "0",
          hs_is_closed_lost: false,
          hs_is_closed_won: false,
          hs_is_deal_split: false,
          hs_is_open_count: "1",
          hs_lastmodifieddate: "2025-03-25T11:45:08.852Z",
          hs_num_associated_active_deal_registrations: "0",
          hs_num_associated_deal_registrations: "0",
          hs_num_associated_deal_splits: "0",
          hs_num_of_associated_line_items: "0",
          hs_num_target_accounts: "0",
          hs_object_id: "35040491681",
          hs_object_source: "INTEGRATION",
          hs_object_source_id: "9892307",
          hs_object_source_label: "INTEGRATION",
          hs_open_deal_create_date: "1742903108852",
          hs_projected_amount: "0",
          hs_projected_amount_in_home_currency: "0",
          hs_v2_date_entered_current_stage: "2025-03-25T11:45:08.852Z",
          hs_v2_time_in_current_stage: "2025-03-25T11:45:08.852Z",
          num_associated_contacts: "0",
          num_notes: "0",
          pipeline: "default",
        },
        createdAt: "2025-03-25T11:45:08.852Z",
        updatedAt: "2025-03-25T11:45:08.852Z",
        archived: false,
      };
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockData),
      });
      const body: deal = {
        properties: {
          usd_amount: 100,
          gbp_amount: 100,
          closedate: String(Date.now()),
          dealname: "Add Funds",
          pipeline: "default",
          dealstage: "contractsent",
        },
        associations: [
          {
            to: { id: "13213213" },
            types: [
              { associationCategory: "HUBSPOT_DEFINED", associationTypeId: 3 },
            ],
          },
        ],
      };

      const response = await postDeal(body);
      const rjson = await response.json();

      expect(rjson).toEqual(mockData);
      expect(response.ok).toBe(true);
    });
    it("should throw an error on failed request", async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: jest.fn().mockResolvedValueOnce({ message: "Error" }),
      });

      const body: deal = {
        properties: {
          usd_amount: 100,
          gbp_amount: 100,
          closedate: String(Date.now()),
          dealname: "Add Funds",
          pipeline: "default",
          dealstage: "contractsent",
        },
        associations: [
          {
            to: { id: "" },
            types: [
              { associationCategory: "HUBSPOT_DEFINED", associationTypeId: 3 },
            ],
          },
        ],
      };
      await expect(postDeal(body)).rejects.toThrow("Error fetching api");
    });
  });

  describe("Get Deal", () => {
    it("should send a POST request and return response", async () => {
      const mockData = {
        total: 1,
        results: [
          {
            id: "108720619322",
            properties: {
              createdate: "2025-03-25T12:34:09.412Z",
              email: "test@tester2.com",
              firstname: "Test",
              hs_object_id: "108720619322",
              lastmodifieddate: "2025-03-25T12:34:18.953Z",
              lastname: null,
            },
            createdAt: "2025-03-25T12:34:09.412Z",
            updatedAt: "2025-03-25T12:34:18.953Z",
            archived: false,
          },
        ],
      };
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockData),
      });
      const body: filter = {
        filterGroups: [
            {
              filters: [
                {
                  propertyName: "email",
                  operator: "EQ",
                  value: "string@email.com",
                }
              ],
            }
          ]
      };

      const response = await getContact(body);
      const rjson = await response.json();

      expect(rjson).toEqual(mockData);
      expect(response.ok).toBe(true);
    });
    it("should throw an error on failed request", async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: jest.fn().mockResolvedValueOnce({ message: "Error" }),
      });

      const body: filter = {
        filterGroups: [
            {
              filters: [
                {
                  propertyName: "email",
                  operator: "EQ",
                  value: "string@email.com",
                }
              ],
            }
          ]
      };
      await expect(getContact(body)).rejects.toThrow("Error fetching api");
    });
  });
});
