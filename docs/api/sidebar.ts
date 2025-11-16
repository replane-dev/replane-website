import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "api/replane-api",
    },
    {
      type: "category",
      label: "Configs",
      items: [
        {
          type: "doc",
          id: "api/get-config-value",
          label: "Get config value",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Schemas",
      items: [
        {
          type: "doc",
          id: "api/schemas/configvalueresponse",
          label: "ConfigValueResponse",
          className: "schema",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
