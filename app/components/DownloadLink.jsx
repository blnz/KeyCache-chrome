import React from 'react';
import FlatButton from 'material-ui/FlatButton';

export default class DownloadLink extends React.Component {
  static propTypes = {
    filename: React.PropTypes.string,
    label: React.PropTypes.string,
    style: React.PropTypes.object,
    exportFile: React.PropTypes.func,
  }

  static defaultProps = {
    filename: 'file.txt',
    label: 'Save',
    style: {
      margin: '5px 5px 0px 0px',
      textDecoration: 'underline',
      color: 'blue',
      cursor: 'pointer'
    },
    exportFile: () => 'yo buddy'
  }

  handleDownloadClick = (event) => {
    const magicDownload = (text, fileName) => {
      const blob = new Blob([text], {
        type: 'text/csv;charset=utf8;'
      });

      // create hidden link
      const element = document.createElement('a');
      document.body.appendChild(element);
      const url = window.URL.createObjectURL(blob);
      element.setAttribute('href', url);
      element.setAttribute('download', fileName);
      element.style.display = '';

      element.click();

      document.body.removeChild(element);
      event.stopPropagation();
    };

    const fileType = event.target.innerText;
    const text = this.props.exportFile(fileType);

    if (text instanceof Promise) {
      text.then(
        result => magicDownload(result, this.props.filename)
      );
    } else {
      magicDownload(text, this.props.filename);
    }
  }

  render() {
    return (
      <FlatButton
        label={this.props.label}
        primary
        onTouchTap={this.handleDownloadClick.bind(this)}
      />
    );
  }
}
