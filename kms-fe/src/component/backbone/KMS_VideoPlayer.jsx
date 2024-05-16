import React from 'react';
import ReactPlayer from 'react-player';

const KMS_VideoPlayer = ({ videoFileName }) => {
  return (
    <div className="react-player-container" style={{ width: '100%', maxWidth: '100%', height:'500px', maxHeight:'100%', margin: 'auto' }}>
      <ReactPlayer
        url={videoFileName}
        controls
        width="100%"
        height="100%"
      />
    </div>
  );
};

export default KMS_VideoPlayer;
