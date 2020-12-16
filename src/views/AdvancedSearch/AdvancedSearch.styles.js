import { makeStyles } from "@material-ui/core";

const styles = theme => ({
  formControl: {
    minWidth: 120,
    width: "100%"
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  "MuiInputLabel-outlined" : {
    transform: "translate(14px, 13px) scale(1)"
  },
  checkbox: {
    paddingTop: theme.spacing(0.3),
    paddingBottom: theme.spacing(0.3),
    paddingRight: theme.spacing(0.3)
  },
  searchResultContainer: {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    top: 0,
    maxHeight: "100%"
  },
  searchResults: {
    marginTop: "20px",
    width: "100%",
    position: "absolute",
    top: "66px",
    width: "100%",
    justifyContent: "flex-end"
  },
  expansionPanel: {
    boxShadow: "none",
    border: "1px solid rgba(0, 0, 0, 0.12)"
  },
  searchIconFab: {
    minHeight: "30px",
    height: "30px",
    width: "30px",
  }
});

export default styles;