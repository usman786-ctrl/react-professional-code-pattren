import { Box, Button, IconButton, Typography, ButtonGroup} from "@material-ui/core";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Stepper from "@material-ui/core/Stepper";
import ArrowBack from "@material-ui/icons/ArrowBack";
import CloseRounded from "@material-ui/icons/CloseRounded";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import {
  getReasonCodes,
  getShipmentDetails,
  updateContainerTrackingNumber,
  updateShipmentDataInReducer,
  updateShipmentDetails,
  validateBarcode,
  getCustomerVerificationCodes,
  updateCustomerVerification,
} from "../../../actions/shipmentDetails";
import {
  API_CONSTANTS,
  SHIPMENT_TYPE_NAMES_BY_NAME,
} from "../../../config/config";
import {
  discardError,
  toaster,
  isReadyForCustomerPick,
  isPacking,
  getStatusDescription,
  isCustomerPick,
} from "../../../config/util";
import { initialShipmentData } from "../../../reducers/shipmentDetail";
import Packing from "../../Packing/Packing";
import Pick from "../../Pick/Pick";
import { useStyles } from "./Shipment.styles";

const stepsComponent = {
  PICK: Pick,
  PACK: Packing,
};

const stepsType = {
  PICK: "PICK",
  PACK: "PACK",
};

const initialSteps = [
  {
    title: "Pick Shipment",
    isStepCompleted: false,
    type: "PICK",
    nextStepLabel: "Start Packing",
  },
  {
    title: "Pack Shipment",
    isStepCompleted: false,
    type: "PACK",
    nextStepLabel: "Start Ship",
    handleNext: (history) => {
      history.push("/startShip");
    },
  },
];

const Shipment = ({
  shipmentData,
  ShipmentLine,
  Container,
  shipmentKey,
  getShipmentDetails,
  getReasonCodes,
  getCustomerVerificationCodes,
  updateShipmentDataInReducer,
  updateCustomerVerification,
  ...props
}) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [steps, setSteps] = useState(initialSteps.map((dt) => ({ ...dt })));

  useEffect(() => {
    if (props.link.viewOnly === true) {
      setStepCompleted(stepsType.PICK);
    }

    if (isReadyForCustomerPick(shipmentData.statusDetails.NAME)) {
      updateShipmentData({
        ShipmentLines: {
          ShipmentLine: ShipmentLine.map((dt) => {
            return {
              ...dt,
              BackroomPickedQuantity: 0,
            };
          }),
        },
      });
    }
  }, []);

  useEffect(() => {
    if (isPacking(shipmentData.statusDetails.NAME)) {
      setStepCompleted(stepsType.PICK);
    }

    if (!shipmentData.statusDetails.STATUS) {
      props.history.push("/");
    }
  }, [shipmentData.statusDetails]);

  useEffect(() => {
    if (!shipmentData.ShipmentLines.ShipmentLine.length) {
      getShipmentDetails(shipmentKey)
        .then((res) => {
          if (res) {
            if (res.EnterpriseCode) {
              getReasonCodes(res.EnterpriseCode, shipmentKey);
              getCustomerVerificationCodes(res.EnterpriseCode, shipmentKey);
            }

            if (isPacking(shipmentData.statusDetails.NAME)) {
              setActiveStep(1);
            }
          }
        })
        .catch(discardError);
    }
  }, [shipmentKey]);

  useEffect(() => {
    console.log(ShipmentLine, "ShipmentLine-----");
    if (!ShipmentLine.length) {
      return;
    }

    let isShipmentPickDone = true;

    ShipmentLine.map((shipmentLine) => {
      if (
        shipmentLine.Quantity !==
        shipmentLine.BackroomPickedQuantity + shipmentLine.ShortageQty
      ) {
        isShipmentPickDone = false;
      }
    });

    if (isShipmentPickDone !== shipmentData.isShipmentPickDone) {
      updateShipmentData({ isShipmentPickDone });
    }
  }, [ShipmentLine]);

  useEffect(() => {
    if (!Container.length || !ShipmentLine.length) {
      return;
    }

    let isBoxingDone = true;

    ShipmentLine.map((shipmentLine) => {
      const shipmentLineQuantity = shipmentLine.Quantity;

      let shipmentLineBoxedQuantity = 0;
      Container.map((container) => {
        if (container.ContainerDetails.ContainerDetail) {
          container.ContainerDetails.ContainerDetail.map((containerItem) => {
            if (
              containerItem.ShipmentLineKey === shipmentLine.ShipmentLineKey
            ) {
              shipmentLineBoxedQuantity += Math.round(containerItem.Quantity);
            }
          });
        }
      });

      if (shipmentLineQuantity !== shipmentLineBoxedQuantity) {
        isBoxingDone = false;
      }
    });

    if (isBoxingDone !== shipmentData.isBoxingDone) {
      updateShipmentData({ isBoxingDone });
    }
  }, [Container]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const updateShipmentData = (dataToUpdate) => {
    updateShipmentDataInReducer(shipmentKey, dataToUpdate);
  };

  const setStepCompleted = (type, bool = true) => {
    setSteps((prevSteps) => {
      return prevSteps.map((dt) => {
        if (dt.type === type) {
          return {
            ...dt,
            isStepCompleted: bool,
          };
        }
        return dt;
      });
    });
  };

  const onFinishPicking = () => {
    let status = API_CONSTANTS.TRANSACTION_ID.YCD_BACKROOM_PICK;

    if (isReadyForCustomerPick(shipmentData.statusDetails.NAME)) {
      status = API_CONSTANTS.TRANSACTION_ID.CONFIRM_SHIPMENT;
    }

    props
      .updateShipmentDetails(shipmentKey, shipmentData, status)
      .then(async () => {
        console.log("calling api");
        if (
          isReadyForCustomerPick(shipmentData.statusDetails.NAME) &&
          ShipmentLine[0]?.OrderHeaderKey
        ) {
          await updateCustomerVerification(
            ShipmentLine[0].OrderHeaderKey,
            shipmentData.noteText
          );
        }
        await getShipmentDetails(shipmentKey);

        if (isReadyForCustomerPick(shipmentData.statusDetails.NAME)) {
          updateShipmentData({
            isShipmentPickDoneUpdatedOnServer: true,
            statusDetails: {
              ...SHIPMENT_TYPE_NAMES_BY_NAME.SHIPPED_FROM_STORE, // change status to shipped from store
            },
          });

          // make view only
          props.setVisitedLinks((prevLinks) =>
            prevLinks.map((dt) => {
              if (dt.shipmentKey === shipmentKey) {
                return {
                  ...dt,
                  viewOnly: true,
                };
              }
              return dt;
            })
          );
        } else if (isCustomerPick(shipmentData.statusDetails.NAME)) {
          updateShipmentData({
            isShipmentPickDoneUpdatedOnServer: true,
            statusDetails: {
              ...SHIPMENT_TYPE_NAMES_BY_NAME.READY_FOR_CUSTOMER_PICK, // change status to ready for customer pick
            },
          });
        } else {
          updateShipmentData({
            isShipmentPickDoneUpdatedOnServer: true,
            statusDetails: {
              ...SHIPMENT_TYPE_NAMES_BY_NAME.SHIPMENTS_TO_PACK, // change status to pack
            },
          });
        }

        toaster.show("Shipment Pick Successful!");
      })
      .catch(console.log);
  };

  const onSuspendPicking = () => {
    let status = "";

    if (
      shipmentData.statusDetails.NAME !==
      SHIPMENT_TYPE_NAMES_BY_NAME.CUSTOMER_PICKS_IN_PROGRESS.NAME
    ) {
      status = API_CONSTANTS.TRANSACTION_ID.YCD_BACKROOM_PICK;
    }

    props.updateShipmentDetails(shipmentKey, shipmentData, status).then(() => {
      toaster.show("Succeed!");
      props.history.goBack();
    });
  };

  useEffect(() => {
    if (shipmentData.isBoxingDoneUpdatedOnServer) {
      setStepCompleted(stepsType.PACK);
    }
  }, [shipmentData.isBoxingDoneUpdatedOnServer]);

  useEffect(() => {
    if (shipmentData.isShipmentPickDoneUpdatedOnServer) {
      setStepCompleted(stepsType.PICK);
    }
  }, [shipmentData.isShipmentPickDoneUpdatedOnServer]);

  const onFinishPacking = (containersTrackingNo, isPackingCompleted = true) => {
    props
      .updateContainerTrackingNumber(
        shipmentKey,
        containersTrackingNo,
        isPackingCompleted
      )
      .then(async () => {
        if (isPackingCompleted) {
          updateShipmentData({
            isBoxingDoneUpdatedOnServer: true,
            statusDetails: { ...SHIPMENT_TYPE_NAMES_BY_NAME.SHIPMENTS_TO_SHIP }, // change status to ship
          });

          await getShipmentDetails(shipmentKey).catch(discardError);

          toaster.show("Succeed!");
        } else {
          props.history.goBack();
        }
      })
      .catch(discardError);
  };

  const getStepContent = () => {
    const step = steps[activeStep];
    const StepContent = stepsComponent[step.type];
    return (
      <StepContent
        {...props}
        {...shipmentData}
        isStepCompleted={step.isStepCompleted}
        updateShipmentData={updateShipmentData}
        updateShipmentLine={updateShipmentLine}
        onFinishPicking={onFinishPicking}
        onSuspendPicking={onSuspendPicking}
        onFinishPacking={(containersTrackingNo) =>
          onFinishPacking(containersTrackingNo)
        }
        onSuspendPacking={(containersTrackingNo) =>
          onFinishPacking(containersTrackingNo, false)
        }
        ShipmentLine={ShipmentLine}
        Container={Container}
        validateBarcode={(barcode) =>
          props.validateBarcode(barcode, shipmentData.EnterpriseCode)
        }
      />
    );
  };

  const updateShipmentLine = (index, data) => {
    if (ShipmentLine?.[index]) {
      const dataToUpdate = {
        ShipmentLines: {
          ShipmentLine: ShipmentLine.map((dt, i) => ({
            ...dt,
            ...(i === index ? data : null),
          })),
        },
        isShipmentChanged: true,
      };

      updateShipmentData(dataToUpdate);
    }
  };

  const goBackToList = () => {
    props.history.goBack();
  };

  if (!props.match || props.match.params.shipmentKey !== shipmentKey) {
    return null;
  }

  const onClose = () => {
    props.setVisitedLinks((prevLinks) =>
      prevLinks.filter((dt) => dt.id !== props.link.id)
    );

    props.history.goBack();
  };

  const startCustomerPick = () => {
    updateShipmentData({
      ShipmentLines: {
        ShipmentLine: ShipmentLine.map((dt) => {
          return {
            ...dt,
            BackroomPickedQuantity: 0,
          };
        }),
      },
    });

    setStepCompleted(stepsType.PICK, false);
  };

  return (
    <div className={classes.root}>
      <Box borderBottom={3} mb={3}>
        <Typography variant="h5" align="left">
          <IconButton
            aria-label="delete"
            size="large"
            style={{ cssFloat: "left", marginTop: "-10px" }}
            onClick={goBackToList}
          >
            <ArrowBack fontSize="inherit" />
          </IconButton>   
          <ButtonGroup style={{marginRight:'auto'}} size="large" color="primary" aria-label="large outlined primary button group">
            <Button variant="outlined" color="primary"><big>{props.link.OrderNo}</big></Button>
            <Button variant="contained" >{getStatusDescription(shipmentData.statusDetails.STATUS,
                  shipmentData.statusDetails.DELIVERY_METHOD
                )}
            </Button>
          </ButtonGroup>    
          <IconButton
            aria-label="delete"
            style={{
              fontSize: "large",
              cssFloat: "right",
              marginTop: "-10px",
            }}
            onClick={onClose}
          >
            <CloseRounded fontSize="inherit" />
          </IconButton>
        </Typography>
      </Box>
      {!isReadyForCustomerPick(shipmentData.statusDetails.NAME) &&
        !isCustomerPick(shipmentData.statusDetails.NAME) &&
        !props.link.viewOnly && (
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((step, index) => {
              const stepProps = {
                completed: step.isStepCompleted,
              };
              const labelProps = {};

              return (
                <Step key={step.title} {...stepProps}>
                  <StepLabel {...labelProps}>{step.title}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
        )}

      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed - you&apos;re finished
            </Typography>
          </div>
        ) : (
          <div>
            {getStepContent()}
            {props.link.viewOnly !== true && (
              <Box display="flex" justifyContent="space-between">
                <Button
                  style={{ visibility: activeStep > 0 ? "visible" : "hidden" }}
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  className={classes.button}
                >
                  Back
                </Button>

                {steps[activeStep].isStepCompleted &&
                  steps[activeStep].nextStepLabel && (
                    <React.Fragment>
                      {isReadyForCustomerPick(
                        shipmentData.statusDetails?.NAME
                      ) ? (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={startCustomerPick}
                          className={classes.button}
                        >
                          Start Customer Pick
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={
                            steps[activeStep].handleNext
                              ? () =>
                                  steps[activeStep].handleNext(props.history)
                              : handleNext
                          }
                          className={classes.button}
                        >
                          {steps[activeStep].nextStepLabel}
                        </Button>
                      )}
                    </React.Fragment>
                  )}
              </Box>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const getShipmentData = createSelector(
  [(state, props) => state.ShipmentDetail.shipmentsByKey[props.shipmentKey]],
  (shipmentData) => ({
    ...initialShipmentData,
    ...shipmentData,
  })
);

const getShipmentLine = createSelector(
  [
    (state, props) =>
      state.ShipmentDetail.shipmentsByKey[props.shipmentKey]?.ShipmentLines
        ?.ShipmentLine,
  ],
  (ShipmentLine = []) => ShipmentLine
);

const getContainer = createSelector(
  [
    (state, props) =>
      state.ShipmentDetail.shipmentsByKey[props.shipmentKey]?.Containers
        ?.Container,
  ],
  (Container = []) => Container
);

const mapStateToProps = (state, props) => {
  return {
    shipmentData: getShipmentData(state, props),
    ShipmentLine: getShipmentLine(state, props),
    Container: getContainer(state, props),
  };
};

function mapDispatchToProps(dispatch) {
  return {
    updateShipmentDataInReducer: (shpKey, dataToUpdate) =>
      dispatch(updateShipmentDataInReducer(shpKey, dataToUpdate)),
    updateCustomerVerification: (orderNo, noteText) =>
      dispatch(updateCustomerVerification(orderNo, noteText)),
    getReasonCodes: (enterpriseCode, shpKey) =>
      dispatch(getReasonCodes(enterpriseCode, shpKey)),
    getCustomerVerificationCodes: (enterpriseCode, shpKey) =>
      dispatch(getCustomerVerificationCodes(enterpriseCode, shpKey)),
    getShipmentDetails: (shipmentKey) =>
      dispatch(getShipmentDetails(shipmentKey)),
    validateBarcode: (barcode, enterpriseCode) =>
      dispatch(validateBarcode(barcode, enterpriseCode)),
    updateShipmentDetails: (shipmentKey, shipmentData, status) =>
      dispatch(updateShipmentDetails(shipmentKey, shipmentData, status)),
    updateContainerTrackingNumber: (
      shipmentKey,
      containersTrackingNo,
      isPackingCompleted
    ) =>
      dispatch(
        updateContainerTrackingNumber(
          shipmentKey,
          containersTrackingNo,
          isPackingCompleted
        )
      ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Shipment);
