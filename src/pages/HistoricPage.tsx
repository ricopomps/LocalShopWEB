import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as HistoricApi from "../network/historicApi";
import { toast } from "react-toastify";
import { Historic as HistoricModel } from "../models/historic";
import Historic from "../components/Historic";
import { Button, Card } from "react-bootstrap";
import ShoppingList from "../components/ShoppingList";
import * as ShoppingListApi from "../network/shoppingListApi";
import styles from "../styles/HistoricPage.module.css";
import * as UsersApi from "../network/notes_api";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { User } from "../models/user";
import { copyShoppingList } from "../network/shoppingListApi";
import { useShoppingList } from "../context/ShoppingListContext";

interface HistoricPageProps {}

const HistoricPage = ({}: HistoricPageProps) => {
  const {
    shoppingList,clearShoppingList
    
  } = useShoppingList();
  const location = useLocation();
  const [selectedHistoric, setSelectedHistoric] =
    useState<HistoricModel | null>(null);
  const queryParameters = new URLSearchParams(location.search);
  const historic = queryParameters.get("historic");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!historic) throw Error("Produto inválido");
        const selectedHistoricResponse = await HistoricApi.getHistoric(
          historic
        );
        setSelectedHistoric(selectedHistoricResponse);
      } catch (error: any) {
        toast.error(error?.response?.data?.error ?? error?.message);
      }
    };
    fetchData();
  }, []);

  const goBack = () => {
    navigate(-1);
  };
  
  if (!selectedHistoric) return <></>;

  const copy = async () => {
    try {
      await ShoppingListApi.copyShoppingList(selectedHistoric._id);
      if(shoppingList.storeId === selectedHistoric.store._id)
      clearShoppingList();
    toast.success("Lista de compras copiada!");
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? error?.message);
    }
  };

  return (
    <div>
      <div>
        <Button onClick={goBack}>Voltar</Button>
      </div>
      <div className={styles.main}>
        <Historic historic={selectedHistoric} onHistoricClicked={() => {}} />
        <h3 className={styles.descricao}>Descrição</h3>
        <Card className={styles.card}>{selectedHistoric.totalValue}</Card>
        <Button onClick={copy}> Copiar </Button>
      </div>
    </div>
  );
};

export default HistoricPage;
