export const charTranslator = (die_faces, value=die_faces, fill = true) => {
  let char = '';
  if (die_faces === 4) {
    if (fill) {
      switch (value) {
        case 1:
          char = 'A';
          break;
        case 2:
          char = 'B';
          break;
        case 3:
          char = 'C';
          break;
        case 4:
          char = 'D';
          break;
        default:
          char = '?';
      }
    } else {
      switch (value) {
        case 1:
          char = '!';
          break;
        case 2:
          char = '@';
          break;
        case 3:
          char = '#';
          break;
        case 4:
          char = '$';
          break;
        default:
          char = '?';
      }
    }
  } else if (die_faces === 6) {
    if (fill) {
      switch (value) {
        case 1:
          char = 'A';
          break;
        case 2:
          char = 'B';
          break;
        case 3:
          char = 'C';
          break;
        case 4:
          char = 'D';
          break;
        case 5:
          char = 'E';
          break;
        case 6:
          char = 'F';
          break;
        default:
          char = '?';
      }
    } else {
      switch (value) {
        case 1:
          char = 'a';
          break;
        case 2:
          char = 'b';
          break;
        case 3:
          char = 'c';
          break;
        case 4:
          char = 'd';
          break;
        case 5:
          char = 'e';
          break;
        case 6:
          char = 'f';
          break;
        default:
          char = '?';
      }
    }
  } else if (die_faces === 8) {
    if (fill) {
      switch (value) {
        case 1:
          char = 'A';
          break;
        case 2:
          char = 'B';
          break;
        case 3:
          char = 'C';
          break;
        case 4:
          char = 'D';
          break;
        case 5:
          char = 'E';
          break;
        case 6:
          char = 'F';
          break;
        case 7:
          char = 'G';
          break;
        case 8:
          char = 'H';
          break;
        default:
          char = '?';
      }
    } else {
      switch (value) {
        case 1:
          char = 'a';
          break;
        case 2:
          char = 'b';
          break;
        case 3:
          char = 'c';
          break;
        case 4:
          char = 'd';
          break;
        case 5:
          char = 'e';
          break;
        case 6:
          char = 'f';
          break;
        case 7:
          char = 'g';
          break;
        case 8:
          char = 'h';
          break;
        default:
          char = '?';
      }
    }
  } else if (die_faces === 10) {
    if (fill) {
      switch (value) {
        case 1:
          char = 'B';
          break;
        case 2:
          char = 'C';
          break;
        case 3:
          char = 'D';
          break;
        case 4:
          char = 'E';
          break;
        case 5:
          char = 'F';
          break;
        case 6:
          char = 'G';
          break;
        case 7:
          char = 'H';
          break;
        case 8:
          char = 'I';
          break;
        case 9:
          char = 'J';
          break;
        case 10:
          char = 'L';
          break;
        default:
          char = '?';
      }    
    } else {
      switch (value) {
        case 1:
          char = 'b';
          break;
        case 2:
          char = 'c';
          break;
        case 3:
          char = 'd';
          break;
        case 4:
          char = 'e';
          break;
        case 5:
          char = 'f';
          break;
        case 6:
          char = 'g';
          break;
        case 7:
          char = 'h';
          break;
        case 8:
          char = 'i';
          break;
        case 9:
          char = 'j';
          break;
        case 10:
          char = 'l';
          break;
        default:
          char = '?';
      }
    }
  } else if (die_faces === 12) {
    if (fill) {
      switch (value) {
        case 1:
          char ='A';
          break;
        case 2:
          char = 'B';
          break;
        case 3:
          char = 'C';
          break;
        case 4:
          char = 'D';
          break;
        case 5:
          char = 'E';
          break;
        case 6:
          char = 'F';
          break;
        case 7:
          char = 'G';
          break;        
        case 8:
          char = 'H';
          break;
        case 9:
          char = 'I';
          break;
        case 10:
          char = 'J';
          break;
        case 11:
          char = 'K';
          break;
        case 12:
          char = 'L';
          break;
        default:
          char = '?';
      }
    } else {
      switch (value) {
        case 1:
          char = 'a';
          break;
        case 2:
          char = 'b';
          break;
        case 3:
          char = 'c';
          break;
        case 4:
          char = 'd';
          break;
        case 5:
          char = 'e';
          break;
        case 6:
          char = 'f';
          break;
        case 7:
          char = 'g';
          break;
        case 8:
          char = 'h';
          break;        
        case 9:
          char = 'i';
          break;
        case 10:
          char = 'j';
          break;
        case 11:
          char = 'k';
          break;
        case 12:
          char = 'l';
          break;
        default:
          char = '?';
      } 
    } 
  } else {
    char = '?';
  }
  return char;
};