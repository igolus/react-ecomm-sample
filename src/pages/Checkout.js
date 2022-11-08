import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import CartContext from "../context/cart";
import {useSelectedProducts} from "../hooks/useProducts";
import Container from "@material-ui/core/Container";
import {
  addPaymentDoneListener,
  initStripeTerminal,
  sendTerminalPayment
} from "../util/terminalUtil";
import CheckIcon from "@material-ui/icons/Check";
import Button from "@material-ui/core/Button";
import {Box} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import {useHistory} from "react-router-dom";

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

export default function Checkout() {
  const { cart, clearAll } = React.useContext(CartContext);
  const { response: products, loading } = useSelectedProducts(cart);
  const [total, setTotal] = useState(0);
  const [terminalLoaded, setTerminalLoaded] = useState(false);
  const classes = useStyles();
  const history = useHistory();

  function getTicketCode() {
    let code = "";
    products.forEach(p => {
      code += "printer.leftRight(\"" + p.quantity + "x" + p.title + "\", \"Euros "+ p.total + "\")\n"
    })
    const total = products.map((item) => item.total).reduce((prev, next) => prev + next);
    code += "printer.drawLine()\n"
    code += "printer.leftRight(\"" + "TOTAL" + "\", \"Euros "+ total + "\")\n"

    console.log(code);
    return code;
  }

  useEffect(() => {
    if (products) {
      window['clearListeners']();
      window['initStripeTerminal'](() => {
        setTerminalLoaded(true)
      });
      window['addPaymentDoneListener'](() => {
        window['sendPrintTicket'](getTicketCode())
        clearAll();
        history.push("/confirmed");
      })
    }

  }, [products])

  useEffect(() => {
    if (!products) {
      return;
    }
    const updatedProducts = products.map((product) => {
      const item = cart.find((item) => item.id === product.id);
      product.quantity = item.quantity;
      product.total = item.quantity * product.price;
      return product;
    });
    const total = updatedProducts.map((item) => item.total).reduce((prev, next) => prev + next);
    setTotal(total)
  }, [products])


  function pay() {
    window['sendTerminalPayment'](total * 100)
  }

  return (
      <div className={classes.root}>
        <Container maxWidth="lg" style={{textAlign: "center"}}>
          {terminalLoaded ?
            <>
              <h1>Please pay using the payment terminal € {total}</h1>
              <Button
                  style={{marginTop: 5}}
                  variant="contained"
                  color="secondary"
                  onClick={pay}
                  className={classes.button}
                  startIcon={<CheckIcon />}
              >
                Click here to pay with terminal
              </Button>
            </>
              :
              <Box sx={{ display: 'flex', justifyContent: 'center' }} mt={5}>
                <CircularProgress />
              </Box>
          }

        </Container>
      </div>
  );
}
