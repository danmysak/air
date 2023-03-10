import {Button, Message} from 'semantic-ui-react';
import './styles.css';

type Props = {
  message: string,
  onRetry?: () => void,
};

function Error({message, onRetry}: Props) {
  return (
    <div className="error">
      <Message negative>
        {message}
        {onRetry && (
          <>
            <br />
            <div className="error_button">
              <Button onClick={() => onRetry()} className="error_button">Повторити</Button>
            </div>
          </>
        )}
      </Message>
    </div>
  );
}

export default Error;
