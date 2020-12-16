const styles = theme => ({
  container: {
    maxWidth: '700px',
    margin: '0 auto',
  },
  
  flowRow: {
    display: 'flex',
    justifyContent: 'space-between'
  },

  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },

  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
});

export default styles;