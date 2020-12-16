import jsPDF from "jspdf";
import "jspdf-autotable";

// export const API_ROOT = 'http://104.168.243.103:9080/smcfs/restapi/';
export const API_ROOT = "http://localhost:8000/smcfs/restapi/";

export const URI = {
  LOGIN_USER: "invoke/login",
  SHIPMENT_TOTALS: "executeFlow/Shipment?_loginid={0}&_token={1}",
  SHIPMENT_LIST:
    "executeFlow/Shipment?_loginid={0}&_token={1}&ShipNode={2}&_templateKey={3}",
  VALIDATE_BARCODE: "executeFlow/BarCode?_loginid={0}&_token={1}",
  SHORTAGE_CODES:
    "common_code?_loginid={0}&_token={1}&CodeType={2}&_templateKey={3}&OrganizationCode={4}",
  UPDATE_SHIPMENT: "shipment?_loginid={0}&_token={1}",
  SHIPMENT_LIST_FOR_CARRIER:
    "shipment?_loginid={0}&_token={1}&_templateKey={2}&ShipNode={3}&Scac={4}&Status={5}",
  CARRIERS_LIST: "scac?_loginid={0}&_token={1}&_templateKey={2}",
  CHANGE_SHIPMENT_STATUS: "shipment_status?_loginid={0}&_token={1}",
  UPDATE_SHIPMENT_CONTAINER:
    "shipment?_loginid={0}&_token={1}&_templateKey={2}",
  PDF_OWNER:
    "organization?_token={0}&OrganizationCode={1}&_templateKey=HEBA_ORG_DETAIL&_loginid={2}",
  RETURN_ORDER_SEARCH:
    "order?_token={0}&Status={1}&DocumentType={2}&CustomerPhoneNo={3}&_loginid={4}&_templateKey={5}&CustomerEMailID={6}&CustomerFirstName={7}&CustomerLastName={8}",
};

export const API = {
  ORDER: API_ROOT + "order",
};

export const DEFAULT_THEME_COLOR = "#29a6ed";
export const ADVANCE_SEARCH_MENU_KEY = "Advanced Search";
export const RETURN_SEARCH_MENU_KEY = "Return Search";

export const API_CONSTANTS = {
  ALL_PICKS: {
    NAME: "ALL_PICKS",

    CUSTOMER_PICKS: {
      NAME: "CUSTOMER_PICKS",
      STATUS: "1100.70.06.10",
      DELIVERY_METHOD: "PICK",
      ACTION_TEXT: "Start Pick",
    },

    SHIPMENT_PICKS: {
      NAME: "SHIPMENT_PICKS",
      STATUS: "1100.70.06.10",
      DELIVERY_METHOD: "SHP",
      ACTION_TEXT: "Start Pick",
    },

    CUSTOMER_PICKS_IN_PROGRESS: {
      NAME: "CUSTOMER_PICKS_IN_PROGRESS",
      STATUS: "1100.70.06.20",
      DELIVERY_METHOD: "PICK",
      ACTION_TEXT: "Continue Pick",
    },

    SHIPMENT_PICKS_IN_PROGRESS: {
      NAME: "SHIPMENT_PICKS_IN_PROGRESS",
      STATUS: "1100.70.06.20",
      DELIVERY_METHOD: "SHP",
      ACTION_TEXT: "Continue Pick",
    },

    PICKED_BY_CUSTOMER: {
      NAME: "PICKED_BY_CUSTOMER",
      STATUS: "1400",
      DELIVERY_METHOD: "PICK",
      ACTION_TEXT: "View",
    },
    READY_FOR_CUSTOMER_PICK: {
      NAME: "READY_FOR_CUSTOMER_PICK",
      STATUS: "1100.70.06.30",
      DELIVERY_METHOD: "PICK",
      ACTION_TEXT: "Start Customer Pick",
      //ACTION_TEXT: "View",
    },
  },

  ALL_SHIPMENTS: {
    NAME: "ALL_SHIPMENTS",

    SHIPMENTS_TO_PACK: {
      NAME: "SHIPMENTS_TO_PACK",
      STATUS: "1100.70.06.50",
      DELIVERY_METHOD: "SHP",
      ACTION_TEXT: "Start Packing",
    },

    PACKING_IN_PROGRESS: {
      NAME: "PACKING_IN_PROGRESS",
      STATUS: "1100.70.06.70",
      DELIVERY_METHOD: "SHP",
      ACTION_TEXT: "Continue Packing",
    },

    SHIPMENTS_TO_SHIP: {
      NAME: "SHIPMENTS_TO_SHIP",
      STATUS: "1300",
      DELIVERY_METHOD: "SHP",
      ACTION_TEXT: "Start Shipping",
    },

    SHIPPED_FROM_STORE: {
      NAME: "SHIPPED_FROM_STORE",
      STATUS: "1400",
      DELIVERY_METHOD: "SHP",
      ACTION_TEXT: "View",
    },
  },

  SHORTAGE_CODES: {
    CODE_TYPE: "YCD_SHORT_RESOLU",
    YCD_CUST_VERFN_TYP: "YCD_CUST_VERFN_TYP",
  },

  TRANSACTION_ID: {
    YCD_BACKROOM_PICK: "YCD_BACKROOM_PICK",
    YCD_BACKROOM_PICK_IN_PROGRESS: "YCD_BACKROOM_PICK_IN_PROGRESS",
    PACK_SHIPMENT_COMPLETE: "PACK_SHIPMENT_COMPLETE",
    CONFIRM_SHIPMENT: "CONFIRM_SHIPMENT",
  },

  TEMPLATE_KEY: {
    SHIPMENT_LIST: "HEBA_APP_SHIPMENT_LIST",
    CARRIERS_LIST: "HEBA_APP_GET_SCAC_LIST",
    SHORTAGE_CODES: "HEBA_APP_COMMON_CODE",
    SHIPPING_LIST: "HEBA_APP_SHIPPING",
    SHIP_CONTAINER: "HEBA_APP_SHIP_CONTAINER",
    CHANGE_SHIPMENT: "HEBA_APP_CHANGE_SHIPMENT",
  },

  RETURN_ORDER_SEARCH_KEY: {
    STATUS: "3200",
    DOCUMENT_TYPE: "0003",
    TEMPLATE_KEY: "CSR_GET_RETURN_LIST",
  },

  SHIPMENTS_LIST_PAGE_SIZE: 10,
  BARCODE_TYPE: "Item",
  UNAUTHENTICATED_USER_ERROR_CODE: "YCP0427",
  COMMON_ERROR: "Could not procceed your request!",
  AUTH_TIMEOUT: 600000,
};

export const SHIPMENT_TYPE_NAMES_BY_NAME = {
  CUSTOMER_PICKS: {
    NAME: "CUSTOMER_PICKS",
    STATUS: "1100.70.06.10",
    DELIVERY_METHOD: "PICK",
    ACTION_TEXT: "Start Pick",
  },

  CUSTOMER_PICKS_IN_PROGRESS: {
    NAME: "CUSTOMER_PICKS_IN_PROGRESS",
    STATUS: "1100.70.06.20",
    DELIVERY_METHOD: "PICK",
    ACTION_TEXT: "Continue Pick",
  },

  SHIPMENT_PICKS: {
    NAME: "SHIPMENT_PICKS",
    STATUS: "1100.70.06.10",
    DELIVERY_METHOD: "SHP",
    ACTION_TEXT: "Start Pick",
  },

  SHIPMENT_PICKS_IN_PROGRESS: {
    NAME: "SHIPMENT_PICKS_IN_PROGRESS",
    STATUS: "1100.70.06.20",
    DELIVERY_METHOD: "SHP",
    ACTION_TEXT: "Continue Pick",
  },

  PICKED_BY_CUSTOMER: {
    NAME: "PICKED_BY_CUSTOMER",
    STATUS: "1400",
    DELIVERY_METHOD: "PICK",
    ACTION_TEXT: "View",
  },

  READY_FOR_CUSTOMER_PICK: {
    NAME: "READY_FOR_CUSTOMER_PICK",
    STATUS: "1100.70.06.30",
    DELIVERY_METHOD: "PICK",
    ACTION_TEXT: "Start Customer Pick",
  },

  SHIPMENTS_TO_PACK: {
    NAME: "SHIPMENTS_TO_PACK",
    STATUS: "1100.70.06.50",
    DELIVERY_METHOD: "SHP",
    ACTION_TEXT: "Start Packing",
  },

  PACKING_IN_PROGRESS: {
    NAME: "PACKING_IN_PROGRESS",
    STATUS: "1100.70.06.70",
    DELIVERY_METHOD: "SHP",
    ACTION_TEXT: "Continue Packing",
  },

  SHIPMENTS_TO_SHIP: {
    NAME: "SHIPMENTS_TO_SHIP",
    STATUS: "1300",
    DELIVERY_METHOD: "SHP",
    ACTION_TEXT: "Start Ship",
  },

  SHIPPED_FROM_STORE: {
    NAME: "SHIPPED_FROM_STORE",
    STATUS: "1400",
    DELIVERY_METHOD: "SHP",
    ACTION_TEXT: "View",
  },

  ADVANCED_SEARCH: {
    DELIVERY_METHOD: "SEARCH",
    STATUS: "SEARCH",
  },
};

export const SHIPMENT_TYPE = {
  PICK: {
    "1100.70.06.10": {
      NAME: "CUSTOMER_PICKS",
      STATUS: "1100.70.06.10",
      DELIVERY_METHOD: "PICK",
      ACTION_TEXT: "Start Pick",
    },

    "1100.70.06.20": {
      NAME: "CUSTOMER_PICKS_IN_PROGRESS",
      STATUS: "1100.70.06.20",
      DELIVERY_METHOD: "PICK",
      ACTION_TEXT: "Continue Pick",
    },
    "1100.70.06.30": {
      NAME: "READY_FOR_CUSTOMER_PICK",
      STATUS: "1100.70.06.30",
      DELIVERY_METHOD: "PICK",
      ACTION_TEXT: "Start Customer Pick",
    },
  },

  SHP: {
    "1100.70.06.20": {
      NAME: "SHIPMENT_PICKS_IN_PROGRESS",
      STATUS: "1100.70.06.20",
      DELIVERY_METHOD: "SHP",
      ACTION_TEXT: "Continue Pick",
    },

    "1100.70.06.10": {
      NAME: "SHIPMENT_PICKS",
      STATUS: "1100.70.06.10",
      DELIVERY_METHOD: "SHP",
      ACTION_TEXT: "Start Pick",
    },

    "1100.70.06.50": {
      NAME: "SHIPMENTS_TO_PACK",
      STATUS: "1100.70.06.50",
      DELIVERY_METHOD: "SHP",
      ACTION_TEXT: "Start Packing",
    },
    "1100.70.06.70": {
      NAME: "PACKING_IN_PROGRESS",
      STATUS: "1100.70.06.70",
      DELIVERY_METHOD: "SHP",
      ACTION_TEXT: "Continue Packing",
    },

    1300: {
      NAME: "SHIPMENTS_TO_SHIP",
      STATUS: "1300",
      DELIVERY_METHOD: "SHP",
      ACTION_TEXT: "Start Ship",
    },
  },
};

export const StringFormat = function () {
  var s = arguments[0];
  for (var i = 0; i < arguments.length - 1; i += 1) {
    var reg = new RegExp("\\{" + i + "\\}", "gm");
    s = s.replace(reg, arguments[i + 1]);
  }
  return s;
};

export const downloadPdf = (
  printData,
  pathName,
  pdfOwenerDetail,
  shipmentListPayload
) => {
  console.log("--donwloading0-----------------------", printData, pathName);
  if (
    printData &&
    printData.length > 0 &&
    (pathName == "/shipmentsList" || pathName.includes("/advanceSearch"))
  ) {
    let csvData = [];
    const doc = new jsPDF("p", "pt");
    doc.autoTable({ html: "#my-table" });

    printData.map((data) => {
      const orderNo = data.ShipmentLines.ShipmentLine[0].OrderNo;
      const shipmentNo = data.ShipmentNo;
      const items = Math.round(data.TotalNumOfPickableSKUs);

      csvData.push([
        orderNo,
        shipmentNo,
        "Not available",
        "Not available",
        items,
      ]);
    });

    let organizationName = "";
    let address = "";
    if (pdfOwenerDetail && pdfOwenerDetail.OrganizationName) {
      organizationName = pdfOwenerDetail.OrganizationName;
    }

    if (
      pdfOwenerDetail &&
      pdfOwenerDetail.CorporatePersonInfo &&
      pdfOwenerDetail.CorporatePersonInfo
    ) {
      if (pdfOwenerDetail.CorporatePersonInfo.AddressLine1) {
        address =
          address + pdfOwenerDetail.CorporatePersonInfo.AddressLine1 + ",";
      }

      if (pdfOwenerDetail.CorporatePersonInfo.AddressLine2) {
        address =
          address + pdfOwenerDetail.CorporatePersonInfo.AddressLine2 + ",";
      }

      if (pdfOwenerDetail.CorporatePersonInfo.City) {
        address = address + pdfOwenerDetail.CorporatePersonInfo.City + " ";
      }

      if (pdfOwenerDetail.CorporatePersonInfo.State) {
        address = address + pdfOwenerDetail.CorporatePersonInfo.State + " ";
      }

      if (pdfOwenerDetail.CorporatePersonInfo.Country) {
        address = address + pdfOwenerDetail.CorporatePersonInfo.Country;
      }
    }

    let headerText = "";
    if (shipmentListPayload && shipmentListPayload.type) {
      if (shipmentListPayload.type == "CUSTOMER_PICKS_IN_PROGRESS") {
        headerText = "Customer picks in progress";
      } else if (shipmentListPayload.type == "SHIPMENT_PICKS_IN_PROGRESS") {
        headerText = "Shipment picks in progress";
      } else {
        headerText = "Advance picks in progress";
      }
    }

    const headerDivider =
      "-------------------------------------------------------------------------------------";
    var header = function (data) {
      doc.setFontSize(18);
      doc.setTextColor(40);
      doc.setFontStyle("normal");
      doc.text(headerText, data.settings.margin.left, 120);
      doc.text(organizationName, data.settings.margin.left, 40);
      doc.text(address, data.settings.margin.left, 70);
      doc.text(new Date().toDateString(), data.settings.margin.left, 90);
      doc.text(headerDivider, data.settings.margin.left, 100);
    };

    var options = {
      beforePageContent: header,
      margin: {
        top: 130,
      },
      startY: doc.autoTableEndPosY() + 90,
      filename: "test1",
    };

    doc.autoTable(
      ["Order No", "Shipment No", "Order Date", "Status", "No of Items"],
      csvData,
      options
    );

    const pdfName = Date.now();

    doc.setProperties({
      title: `table_${pdfName}.pdf`,
    });

    window.open(doc.output("bloburl"));
  }
};

export const LINK_TYPES = {
  SHIPMENT: "SHIPMENT",
};

export const TOASTER_TIMEOUT = 2000;
