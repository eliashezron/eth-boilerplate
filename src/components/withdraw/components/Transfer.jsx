import { CreditCardOutlined } from "@ant-design/icons";
import { Button, Input, Modal } from "antd";
import Text from "antd/lib/typography/Text";
import { useState, useEffect } from "react";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import AssetSelector from "./AssetSelector";
import DepositAndWithdraw from "../../../chain-info/contracts/DepositAndWithdraw.json";

const styles = {
  card: {
    alignItems: "center",
    width: "100%",
  },
  header: {
    textAlign: "center",
  },
  input: {
    width: "100%",
    outline: "none",
    fontSize: "16px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textverflow: "ellipsis",
    appearance: "textfield",
    color: "#041836",
    fontWeight: "700",
    border: "none",
    backgroundColor: "transparent",
  },
  select: {
    marginTop: "20px",
    display: "flex",
    alignItems: "center",
  },
  textWrapper: { maxWidth: "80px", width: "100%" },
  row: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexDirection: "row",
  },
};

function Transfer() {
  const { Moralis } = useMoralis();
  const [asset, setAsset] = useState();
  const [amount, setAmount] = useState();
  const contractProcessor = useWeb3ExecuteFunction();
  const { abi } = DepositAndWithdraw;
  const [tx, setTx] = useState();
  const [isPending, setisPending] = useState(false);

  useEffect(() => {
    asset && amount ? setTx({ amount, asset }) : setTx();
  }, [asset, amount]);
  async function Deposit() {
    const { asset, amount } = tx;
    console.log("button clicked");
    let options = {
      contractAddress: "0xB8B8F9Ad4963460B1C7562deb41de66e573cd941",
      functionName: "deposit",
      abi: abi,
      params: {
        _token: asset.token_address,
        _amount: Moralis.Units.ETH(amount),
      },
    };
    setisPending(true);
    await contractProcessor.fetch({
      params: options,
      onSuccess: () => {
        let secondsToGo = 3;
        const modal = Modal.success({
          title: "success!",
          content: `You have deposited ${amount}successfully`,
        });
        setisPending(false);
        setTimeout(() => modal.destroy(), secondsToGo * 1000);
        console.log("success");
      },
      onError: (error) => {
        alert(error.data.message);
      },
    });
  }

  return (
    <div style={styles.card}>
      <div style={styles.tranfer}>
        <div style={styles.header}>
          <h3>Deposit Funds</h3>
        </div>
        <div style={styles.select}>
          <div style={styles.textWrapper}>
            <Text strong>Amount:</Text>
          </div>
          <Input
            size="large"
            prefix={<CreditCardOutlined />}
            onChange={(e) => {
              setAmount(`${e.target.value}`);
            }}
          />
        </div>
        <div style={styles.select}>
          <div style={styles.textWrapper}>
            <Text strong>Asset:</Text>
          </div>
          <AssetSelector setAsset={setAsset} style={{ width: "100%" }} />
        </div>
        <Button
          type="primary"
          size="large"
          loading={isPending}
          style={{ width: "100%", marginTop: "25px" }}
          onClick={() => Deposit()}
          disabled={!tx}
        >
          Deposit Tokens
        </Button>
      </div>
    </div>
  );
}

export default Transfer;
