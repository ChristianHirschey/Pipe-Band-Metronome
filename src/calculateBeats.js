const calculateBeats = (dropdowns) => {
    return dropdowns.map(dropdown => {
      let viewBeats;
      if(dropdown.timeSignature === 'rolls') viewBeats = 4;
      else if(dropdown.timeSignature === '2-4') viewBeats = 2;
      else if(dropdown.timeSignature === '3-4') viewBeats = 3;
      else if(dropdown.timeSignature === '4-4') viewBeats = 4;
      else if(dropdown.timeSignature === '6-8') viewBeats = 2;
      else if(dropdown.timeSignature === '9-8') viewBeats = 3;
      else if(dropdown.timeSignature === '3slow') viewBeats = 3;
      else if(dropdown.timeSignature === '4slow') viewBeats = 4;
      else if(dropdown.timeSignature === '4str') viewBeats = 4;
      else if(dropdown.timeSignature === '2-2') viewBeats = 2;
      else if(dropdown.timeSignature === '3-2') viewBeats = 3;
      return viewBeats;
    });
};
  
export default calculateBeats;