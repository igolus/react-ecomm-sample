  import React from "react";
  import {makeStyles} from "@material-ui/core/styles";
  import Container from "@material-ui/core/Container";

  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
    },
    button: {
      marginRight: theme.spacing(1),
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    buttonContainer: {
      textAlign: "center",
      marginTop: theme.spacing(6),
    },
  }));

  export default function Confirmed() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
          <Container maxWidth="lg" style={{textAlign: "center"}}>
            <h1>Thank you your payment is confirmed !!!</h1>
          </Container>
        </div>
    );
  }
