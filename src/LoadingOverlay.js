/**
 * LoadingOverlay
 *
 * Set as child component in a container. Toggle state with `active` prop.
 * React transition group will handle the fade of the overlay.
 */
import React, {Children} from 'react'
import PropTypes from 'prop-types'
import {CSSTransitionGroup} from 'react-transition-group';

import styles from './Overlay.sass';

const FirstChild = props => Children.toArray(props.children)[0] || null;

class LoadingOverlayWrapper extends React.Component {

  componentWillReceiveProps(nextProps) {
    let s = nextProps.style;
    if (nextProps.active && (s.overflow || s.overflowY || s.overflowX)) {
      this.wrapper.scrollTop = 0
    }
  }

  render() {
    const {active, animate, spinner} = this.props;

    let loadNode = null;
    if (active) {
      loadNode = <LoadingOverlay key='the_dimmer' {...this.props} />;
    }

    if (animate) {
      loadNode = (
        <CSSTransitionGroup
          transitionName={{
            enter: styles.enter,
            enterActive: styles.enterActive,
            appear: styles.appear,
            appearActive: styles.appearActive,
            leave: styles.leave,
            leaveActive: styles.leaveActive
          }}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
          transitionAppearTimeout={500}
          component={FirstChild}
        >
          {loadNode}
        </CSSTransitionGroup>
      )
    }

    let wrapperStyle = {
      ...this.props.style
    };

    if (active) {
      if (wrapperStyle.overflow) wrapperStyle.overflow = 'hidden';
      if (wrapperStyle.overflowY) wrapperStyle.overflowY = 'hidden';
      if (wrapperStyle.overflowX) wrapperStyle.overflowX = 'hidden';
    }

    return (
      <div
        ref={n => { this.wrapper = n}}
        className={styles.overlayWrapper}
        style={wrapperStyle}>
        {loadNode}
        {this.props.children}
      </div>
    )
  }
}

LoadingOverlayWrapper.propTypes = {
  active: PropTypes.bool,
  text: PropTypes.string,
  spinner: PropTypes.bool,
  spinnerSize: PropTypes.string,
  className: PropTypes.string,
  background: PropTypes.string,
  color: PropTypes.string,
  zIndex: PropTypes.number,
  animate: PropTypes.bool,
  style: PropTypes.object
};

LoadingOverlayWrapper.defaultProps = {
  active: false,
  className: '',
  background: 'rgba(0, 0, 0, 0.7)',
  spinnerSize: '50px',
  color: '#FFF',
  zIndex: 800,
  animate: false,
  style: {}
};

class LoadingOverlay extends React.Component {
  render() {

    let spinnerNode = null;
    if (this.props.spinner) {
      spinnerNode = (
        <div
          className={styles.spinner}
          style={{width: `${this.props.spinnerSize}`}}>
          <svg viewBox='25 25 50 50' className={styles.svg}>
            <circle cx='50' cy='50' r='20' fill='none' strokeWidth='2' strokeMiterlimit='10'
              className={styles.circle} style={{stroke: `${this.props.color}`}}/>
          </svg>
        </div>
      )
    }

    let textNode = null;
    if (this.props.text) {
      textNode = <div>{this.props.text}</div>;
    }

    let contentNode = null;
    if (this.props.text || this.props.spinner) {
      contentNode = (
        <div className={styles.content}>
          {spinnerNode}
          {textNode}
        </div>
      )
    }

    const overlayStyle = {
      background: `${this.props.background}`,
      color: `${this.props.color}`,
      transition: `opacity ${this.props.speed}ms ease-out`,
      'zIndex': `${this.props.zIndex}`
    };

    return (
      <div
        className={styles.overlay}
        style={overlayStyle}
        key='dimmer'
      >
        {contentNode}
      </div>
    )
  }
}

LoadingOverlay.defaultProps = {
  text: null,
  spinner: false
};


LoadingOverlay.propTypes = {
  text: PropTypes.string,
  spinner: PropTypes.bool,
  background: PropTypes.string,
  color: PropTypes.string,
  speed: PropTypes.string,
  zIndex: PropTypes.number,
  spinnerSize: PropTypes.string
};

export default LoadingOverlayWrapper
