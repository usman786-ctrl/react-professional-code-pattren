import { useLocation } from "react-router-dom";
import { toast, Bounce } from "react-toastify";
import { TOASTER_TIMEOUT, SHIPMENT_TYPE_NAMES_BY_NAME } from "./config";
import { pdf } from "@react-pdf/renderer";

export function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export const getName = (BillToAddress) => {
  let name = "(Missing Name)";
  if (BillToAddress.FirstName || BillToAddress.LastName) {
    name = `${BillToAddress.FirstName} ${BillToAddress.LastName}`.trim();
  }

  return name;
};

export const getShipmentListKey = (
  statusDetails = { ...SHIPMENT_TYPE_NAMES_BY_NAME.ADVANCED_SEARCH }
) => {
  return `${statusDetails.DELIVERY_METHOD}_${statusDetails.STATUS}`;
};

export const discardError = () => null;
export const toaster = {
  show(msg, type = "success", config = {}) {
    toast(msg, {
      type: type,
      transition: Bounce,
      position: "top-right",
      closeButton: true,
      autoClose: TOASTER_TIMEOUT,
      ...config,
    });
  },

  ERROR: "error",
  SUCCESS: "success",
  INFO: "info",
};

export const isReadyForCustomerPick = (name) => {
  return SHIPMENT_TYPE_NAMES_BY_NAME.READY_FOR_CUSTOMER_PICK.NAME === name;
};

export const isCustomerPick = (name) => {
  return [
    SHIPMENT_TYPE_NAMES_BY_NAME.CUSTOMER_PICKS.NAME,
    SHIPMENT_TYPE_NAMES_BY_NAME.CUSTOMER_PICKS_IN_PROGRESS.NAME,
  ].includes(name);
};

export const isPacking = (name) => {
  return [
    SHIPMENT_TYPE_NAMES_BY_NAME.PACKING_IN_PROGRESS.NAME,
    SHIPMENT_TYPE_NAMES_BY_NAME.SHIPMENTS_TO_PACK.NAME,
  ].includes(name);
};

export const getStatusDescription = (status, deliveryMethod) => {
  let statusDesc = "";
  switch (status) {
    case "1100.70.06.10":
      statusDesc = "Ready For Backroom Pick";
      break;
    case "1100.70.06.20":
      statusDesc = "Backroom Pick in Progress";
      break;
    case "1100.70.06.30":
      statusDesc = "Ready For Customer Pick";
      break;
    case "1100.70.06.50":
      statusDesc = "Ready For Packing";
      break;
    case "1100.70.06.70":
      statusDesc = "Shipment Being Packed";
      break;
    case "1400":
      if (deliveryMethod && deliveryMethod == "PICK") {
        statusDesc = "Picked By Customer";
      } else {
        statusDesc = "Shipped From Store";
      }
      break;
    case "1300":
      statusDesc = "Shipment Packed";
      break;
    default:
      break;
  }
  return statusDesc;
};

const saveBlob = (blob, filename) => {
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style.display = "none";
  let url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

export const savePdf = async (document, filename) => {
  saveBlob(await pdf(document).toBlob(), filename);
};
