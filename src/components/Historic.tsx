import { Card } from "react-bootstrap";
import styles from "../styles/Historic.module.css";
import stylesUtils from "../styles/utils.module.css";
import { Historic as HistoricModel } from "../models/historic"
import { formatDate } from "../utils/formatDate";
import { MdDelete } from "react-icons/md";

interface HistoricProps {
  historic: HistoricModel;
  onHistoricClicked: (historic: HistoricModel) => void;
  onDeleteHistoricClicked?: (historic: HistoricModel) => void;
  className?: string;
}

const Historic = ({
  historic,
  onHistoricClicked,
  onDeleteHistoricClicked,
  className,
}: HistoricProps) => {
  const { name, description, createdAt, updatedAt } = historic;

  let createdUpdatedText: string;
  if (updatedAt > createdAt) {
    createdUpdatedText = "Atualizado: " + formatDate(updatedAt);
  } else {
    createdUpdatedText = "Criado: " + formatDate(createdAt);
  }

  return (
    <Card
      onClick={() => onHistoricClicked(historic)}
      className={`${styles.historicCard} ${className}`}
    >
      {historic.image && (
        <Card.Img
          variant="top"
          src={historic.image}
          alt=""
          className={styles.historicImage}
        />
      )}
      <Card.Body className={styles.cardBody}>
        <Card.Title className={`${stylesUtils.flexCenter} ${styles.titleText}`}>
          {name}
          {onDeleteHistoricClicked && (
            <MdDelete
              className="text-muted ms-auto"
              onClick={(e) => {
                onDeleteHistoricClicked(historic);
                e.stopPropagation();
              }}
            />
          )}
        </Card.Title>
        <Card.Text className={`${stylesUtils.flexCenter}${styles.historicText}`}>
          {description}
        </Card.Text>
      </Card.Body>
      <Card.Footer className="text-muted">{createdUpdatedText}</Card.Footer>
    </Card>
  );
};

export default Historic;
