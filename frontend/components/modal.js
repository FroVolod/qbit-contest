import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';


export default class extends React.Component {
  render () {
    return (
      <div>
        <Modal isOpen={this.props.showModal} className={this.props.className}>
          <ModalBody>
            {this.props.messageModal}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => {this.props.isShowModal(false)}}>OK</Button>{' '}
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
