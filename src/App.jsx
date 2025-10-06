import { useState, useRef, useEffect } from 'react';
import { Crown, X, Search, CircleDashed, 
		MousePointerClick, MousePointer2, Asterisk,
		BadgeQuestionMark, Undo2, Redo2, ZoomIn, ZoomOut,
		MessageCircleX, Lightbulb, Languages, CirclePause, Play, CirclePlay, MonitorPause,
		Hourglass, ListChevronsDownUp, ListChevronsUpDown } from 'lucide-react';
import './App.css'
			
const QueenPuzzle = ({ board, colors, hints, solutionSteps }) => {
    const [boardState, setBoardState] = useState({
		cells: board.map(row => row.map(() => null)),
		humans: board.map(row => row.map(() => null)),
		autoXMarks: [],
		undo: [],
		redo: [],
		needClearBoard: false,
	});
    const [step, setStep] = useState(0);
    const [log, setLog] = useState([]);
    const [language, setLanguage] = useState('en');
    const [showHints, setShowHints] = useState(false);
    const [currentHint, setCurrentHint] = useState(0);
	const [isMovedOutPos, setIsMovedOutPos] = useState(false);
	const [isLeftMouseDown, setIsLeftMouseDown] = useState(false);
	const [isRightMouseDown, setIsRightMouseDown] = useState(false);
	const [isMousePressedOnBoard, setIsMousePressedOnBoard] = useState(false);
	const [autoAddX, setAutoAddX] = useState(true);
	const [showMenu, setShowMenu] = useState(true);
	const [showAxes, setShowAxes] = useState(false);
	const [showAnimations, setShowAnimations] = useState(true);
	const [showTimer, setShowTimer] = useState(true);
	const [showLetter, setShowLetter] = useState(true);
	const [addXOnHover, setAddXOnHover] = useState(true);
	const [isWinner, setIsWinner] = useState(0);
	const [isPaused, setIsPaused] = useState(0);
	const [time, setTime] = useState({
		hours: 0,
		minutes: 0,
		seconds: 0,
	});
	const [currentDivRow, setCurrentDivRow] = useState(null);
	const [currentDivCol, setCurrentDivCol] = useState(null);

	let cellsOnHovering = null;
	
	const divBoard = useRef(null);
		
    const divLogHistory = useRef(null);

	const handleMouseDown = (event) => {
		setIsMovedOutPos(false)
		setIsMousePressedOnBoard(true)
		
		if (event.type === 'mousedown') {
			event.preventDefault();
		
			if (event.button === 0) { // 0 indicates the left mouse button
				setIsLeftMouseDown(true);
			}
			if (event.button === 2) { // 0 indicates the left mouse button
				setIsRightMouseDown(true);
			}
		}
	};
	
	const handleMouseUp = (event) => {
		setIsMousePressedOnBoard(false)
		setIsLeftMouseDown(false);
		setIsRightMouseDown(false);
	};
	
	const preventContextMenu = (event) => {
		event.preventDefault();
	};
	
	const calculateAutoX = (row, col, isAddQueen, newBoardState) => {
		if (!autoAddX) return;
		const markXColor = board[row][col];
		const newVal = isAddQueen ? 'x' : null;
		
		const newPos = []
		const { cells, humans, autoXMarks } = newBoardState;
		
		board.forEach((fullRow, r) => 
			fullRow.forEach((cell,c)=> {				
				if (!(r === row && c === col) && humans[r][c] == null) { // ignore queen cell and human marks					
					if (board[r][c] === markXColor  ||
						r === row ||
						c === col ||
						(r >= row - 1 && r <= row+1 && c>= col-1 && c<= col+1)
					){
						newPos.push({r, c})
						// Ignore position if belongs to other autoXMarks
						const shouldChange = !autoXMarks.some(item => 
							!(item.r === row && item.c === col) && 
							item.pos.some(obj => obj.r === r && obj.c === c)
						  );						

						if (shouldChange) {
							cells[r][c] = newVal;
						}
					}
				}
			}
		 ));
		 
		const index = autoXMarks.findIndex(obj => obj.r === row && obj.c === col);
		if (isAddQueen) {
			if (index === -1) {
				autoXMarks.push({r: row, c: col, pos: newPos});
			} else {
				autoXMarks[index] = {...autoXMarks[index], pos: newPos};
			}
		} else if (index !== -1) {
			autoXMarks.splice(index, 1);
		}
	}	
	
	const checkForErrosOrVictory = (checkCells) => {	  
	  const colorCounts = {};
	  const rowCounts = {};
	  const colCounts = {};
	  const neighbors = [];
      
      board.forEach((row, r) => {
        row.forEach((color, c) => {
          if (!colorCounts[color]) {
            colorCounts[color] = { total: 0, queenCells: [] };
          }
		  
		  if (!rowCounts[r]) {
			rowCounts[r] = { total: 0, queenCells: [] };
		  }

		  if (!colCounts[c]) {
			colCounts[c] = { total: 0, queenCells: [] };
		  }
		  
          if (checkCells[r][c] === 'queen' || checkCells[r][c] === 'wrongQueen') {
		    checkCells[r][c] = 'queen';
            colorCounts[color].total++;
			colorCounts[color].queenCells.push({r,c});

			rowCounts[r].total++;
			rowCounts[r].queenCells.push({r,c});
			
			colCounts[c].total++;
			colCounts[c].queenCells.push({r,c});

			for (let i = r-1; i <= r+1; i++){
				for (let j = c-1; j <= c+1; j++){
				  if (i >= 0 && i < row.length && j >= 0 && j < row.length && !(i === r && c === j)) {
				     if (checkCells[i][j] === 'queen' || checkCells[i][j] === 'wrongQueen') {
						if (!neighbors.some(obj => obj.r === i && obj.c === j)) {
							neighbors.push({r: i, c: j})
						}
					 }
				  }
				}
			}
          }
        });
      });
	  
      
	  let winner = true;
	  const colorKeys = Object.keys(colorCounts);
	  for (let item = 0; item < board.length; item++) {
		winner = winner && (colorCounts[colorKeys[item]].total === 1);
		winner = winner && (rowCounts[item].total === 1);
		winner = winner && (colCounts[item].total === 1);
		
		if (colorCounts[colorKeys[item]].total > 1) {
			colorCounts[colorKeys[item]].queenCells.forEach(obj => {
				checkCells[obj.r][obj.c] = 'wrongQueen';
			})
		}
		if (rowCounts[item].total > 1) {
			rowCounts[item].queenCells.forEach(obj => {
				checkCells[obj.r][obj.c] = 'wrongQueen';
			})
		}
		if (colCounts[item].total > 1) {
			colCounts[item].queenCells.forEach(obj => {
				checkCells[obj.r][obj.c] = 'wrongQueen';
			})
		}
	  }
	  
	  winner = winner && neighbors.length === 0;
	  neighbors.forEach(obj => {
				checkCells[obj.r][obj.c] = 'wrongQueen';
			})
	  if (!isWinner) {
		  setIsWinner(winner);
	  } else {
		  if (winner) {
			  setIsWinner(2);
		  }
		  else {
			  setIsWinner(3);
		  }
	  }
	};
	
	const showNeedClearBoard = (cells) => {
		let isEmpty = true;
		cells.forEach((row, r) => row.forEach((col, c)=> isEmpty = isEmpty && (cells[r][c] === null)));
		
		return !isEmpty;
	}
	
	const addUndo = (row, col, value, humanValue, autoXMarks, newBoardState) => {
		newBoardState.redo = [];
		newBoardState.undo.push({ row, col, value, humanValue, autoXMarks });
	}
	
	const redoMove = () => {
		setBoardState(oldBoardState => {
			if (oldBoardState.redo.length === 0) {
				return oldBoardState;
			};
			
			const newBoardState = {			
				undo: [...oldBoardState.undo],
				redo: [...oldBoardState.redo],
			};

			const { row, col, value, humanValue, autoXMarks } = newBoardState.redo.pop();

			// Row === -1 => ClearBoard
			if (row === -1) {
				newBoardState.undo.push({ row, col, value: oldBoardState.cells, humanValue: oldBoardState.humans, autoXMarks: oldBoardState.autoXMarks });
				newBoardState.cells = value;
				newBoardState.humans = humanValue;
				newBoardState.autoXMarks = autoXMarks;
			} else {
				const oldValue = oldBoardState.cells[row][col];
				const oldHumanValue = oldBoardState.humans[row][col];
				newBoardState.undo.push({row, col, value: oldValue, humanValue: oldHumanValue, autoXMarks: oldBoardState.autoXMarks});

				newBoardState.cells = oldBoardState.cells.map(r => [...r]);
				newBoardState.humans = oldBoardState.humans.map(r => [...r]);
				newBoardState.autoXMarks = [...oldBoardState.autoXMarks];
				
				newBoardState.cells[row][col] = value;
				if (value === 'queen' || value === 'wrongQueen') {
					calculateAutoX(row, col, true, newBoardState);
				} else if (oldValue === 'queen' || oldValue === 'wrongQueen') {
					calculateAutoX(row, col, false, newBoardState);
				}
				newBoardState.humans[row][col] = humanValue;
			}
			newBoardState.needClearBoard = showNeedClearBoard(newBoardState.cells);
			checkForErrosOrVictory(newBoardState.cells);
			
			return {
				...oldBoardState,
				...newBoardState,
			}
		});
	}

	const undoMove = () => {
		setBoardState(oldBoardState => {
			if (oldBoardState.undo.length === 0) {
				return oldBoardState;
			};
			
			const newBoardState = {
				undo: [...oldBoardState.undo],
				redo: [...oldBoardState.redo],
			};

			const { row, col, value, humanValue, autoXMarks } = newBoardState.undo.pop();
			
			// Row === -1 => ClearBoard
			if (row === -1) {
				newBoardState.redo.push({ row, col, value: oldBoardState.cells, humanValue: oldBoardState.humans, autoXMarks: oldBoardState.autoXMarks });
				newBoardState.cells = value;
				newBoardState.humans = humanValue;
				newBoardState.autoXMarks = autoXMarks;				
			} else {
				const newRedo = { row, col, value: oldBoardState.cells[row][col], humanValue: oldBoardState.humans[row][col], autoXMarks: oldBoardState.autoXMarks}
				newBoardState.redo.push(newRedo);
				
				newBoardState.cells = oldBoardState.cells.map(r => [...r]);
				newBoardState.humans = oldBoardState.humans.map(r => [...r]);
				newBoardState.autoXMarks = [...oldBoardState.autoXMarks];
				
				newBoardState.cells[row][col] = value;
				if (newRedo.value === 'queen' || newRedo.value === 'wrongQueen') {				
					calculateAutoX(row, col, false, newBoardState);
				} else if (value === 'queen' || value === 'wrongQueen') {
					calculateAutoX(row, col, true, newBoardState);
				}
				newBoardState.humans[row][col] = humanValue;
			}
			newBoardState.needClearBoard = showNeedClearBoard(newBoardState.cells);			
			checkForErrosOrVictory(newBoardState.cells);
			return {
				...oldBoardState,
				...newBoardState,
			}
		});
	}
	
	const updateCellHandleClick = (row, col, value, isAddQueen, showClearBoard, boardState) => {
		const { cells, humans } = boardState;
		cells[row][col] = value;		
		if (isAddQueen !== null) {
			calculateAutoX(row, col, isAddQueen, boardState);
		}
		humans[row][col] = value;		
		if (!showClearBoard) {
			showClearBoard = showNeedClearBoard(cells);
		}
		boardState.needClearBoard = showClearBoard;
		checkForErrosOrVictory(cells);
	}
			
    const handleClick = (row, col) => {
	  if (isMovedOutPos) return;
	  setBoardState(oldBoardState => {
		const newBoardState = {
			cells: oldBoardState.cells.map(r => [...r]),
			humans: oldBoardState.humans.map(r => [...r]),
			autoXMarks: [...oldBoardState.autoXMarks],
			undo: [...oldBoardState.undo],
		}
		
		addUndo(row, col, oldBoardState.cells[row][col], oldBoardState.humans[row][col], null, newBoardState);
		if (oldBoardState.cells[row][col] === null) {
			updateCellHandleClick(row, col, 'x', null, true, newBoardState);
		} else if (oldBoardState.cells[row][col] === 'x') {
			updateCellHandleClick(row, col, 'queen', true, true, newBoardState);
		} else if (oldBoardState.cells[row][col] === 'queen' || oldBoardState.cells[row][col] === 'wrongQueen') {
			updateCellHandleClick(row, col, null, false, false, newBoardState);
		} else {
			updateCellHandleClick(row, col, null, null, false, newBoardState);
		}
	  
		return {
				...oldBoardState,
				...newBoardState
			}
	  });
    };

	const handleTouchMove = (event) => {
		const touch = event.touches[0]; // Get the first touch point
		
		if (touch) {
			const element = document.elementFromPoint(touch.clientX, touch.clientY);

			if (element && !(element.dataset.divCol == currentDivCol && element.dataset.divRow == currentDivRow) && element.dataset.divRow && element.dataset.divCol) {
			  setCurrentDivRow(element.dataset.divRow);
			  setCurrentDivCol(element.dataset.divCol);
			  handleMouseEnterOut({buttons:addXOnHover ? 1 : 2, e: "touchMove"}, element.dataset.divRow, element.dataset.divCol)      
			}
		}
	};

	const handleMouseEnterOut = (event, row, col) => {
		setIsMovedOutPos(true)
		if (!isMousePressedOnBoard) return;
		setBoardState(oldBoardState => {
			const newBoardState = {
				cells: oldBoardState.cells.map(r => [...r]),
				humans: oldBoardState.humans.map(r => [...r]),
				autoXMarks: [...oldBoardState.autoXMarks],
				undo: [...oldBoardState.undo],
			}

			if (event.buttons === 1 && oldBoardState.cells[row][col] === null) {
				addUndo(row, col, oldBoardState.cells[row][col], oldBoardState.humans[row][col], null, newBoardState);
				updateCellHandleClick(row, col, 'x', null, true, newBoardState);
			} else if  (event.buttons === 2 && oldBoardState.cells[row][col] === 'x') {
				addUndo(row, col, oldBoardState.cells[row][col], oldBoardState.humans[row][col], null, newBoardState);
				updateCellHandleClick(row, col, null, null, false, newBoardState);
			}			
			return {
				...oldBoardState,
				...newBoardState
			}
		});		
	}   

	// Scroll log
    useEffect(() => {
      if (divLogHistory.current) {			
        divLogHistory.current.scrollTop = divLogHistory.current.scrollHeight;
      }
    }, [log]);
	
	// Timer
	useEffect(() => {
		const timer = setInterval(() => {
		  setTime((prevTime) => {
			let { hours, minutes, seconds } = prevTime;

			if (isWinner || isPaused) {
			  clearInterval(timer);
			  return prevTime;
			}
			
			seconds++;
			if (seconds > 59) {
				seconds = 0;
				minutes++;
				if (minutes > 59) {
				  minutes = 0
				  hours++
				}          
			}
			return { hours, minutes, seconds };
		  });
		}, 1000);
		return () => clearInterval(timer);
	}, [isWinner, isPaused]);
  
	// Prevent Scroll

	  
	// Salvar no localStorage quando sair
	useEffect(() => {
	  const saveState = () => {
		localStorage.setItem('queenPuzzleAY', JSON.stringify({
		  boardState, step, log, language, autoAddX, showMenu, showAxes, showTimer, showLetter, addXOnHover, isWinner, isPaused, time
		}));
	  };
	  window.addEventListener('beforeunload', saveState);
	  return () => window.removeEventListener('beforeunload', saveState);
	}, [boardState, step, log, language, autoAddX, showMenu, showAxes, showTimer, showLetter, addXOnHover, isWinner, isPaused, time]);
  
	useEffect(() => {
		const storedItems = localStorage.getItem('queenPuzzleAY');
		if (storedItems) {
			try {
				const items = JSON.parse(storedItems);
				if (items.boardState) {
					setBoardState(items.boardState);
				}
				setStep(items.step);
				setLog(items.log);
				setLanguage(items.language);
				setAutoAddX(items.autoAddX);
				setShowMenu(items.showMenu);
				setShowAxes(items.showAxes);
				setShowTimer(items.showTimer);
				setShowLetter(items.showLetter);
				setAddXOnHover(items.addXOnHover);
				setIsWinner(items.isWinner);								
				
				setTimeout(() => {
					setTime(items.time);
					setIsPaused(items.isPaused);
				}, 0);
				
			} catch (error) {
				console.error("Error parsing stored data:", error);
				// Handle error, e.g., clear localStorage or set default state
			}
		}
	}, []); // Empty dependency array ensures this runs only once on mount
  
    const getEmoji = (stepEmoji) => stepEmoji === (solutionSteps.length - 1) ? "🏁" : "🔍";

    const nextStep = () => {
      if (step < solutionSteps.length - 1) {
		const nextStep = step + 1;
		const nextStepData = solutionSteps[nextStep];
		const newLog = [...log];		
		
		const desc = language === 'pt' ? nextStepData.descPt : nextStepData.descEn;
		newLog.push (`${getEmoji(step+1)} ${language === 'pt' ? 'Passo' : 'Step'} ${step + 1}: ${desc.split('\n')[0]}`);
		
		setLog(newLog);
		setStep(nextStep);
		setIsPaused(false);
		setShowAnimations(true);
		setShowAxes(true);
		  
		setBoardState(oldBoardState => {
			const newBoardState = {
				cells: oldBoardState.cells.map(r => [...r]),
				humans: oldBoardState.humans.map(r => [...r]),
				undo: [],
				redo: [],
				needClearBoard: true,
			}

			if (nextStepData.removePositions) {
			  nextStepData.removePositions.forEach(([r, c]) => {
				  newBoardState.cells[r][c] = null;
				  newBoardState.humans[r][c] = null;
			  });
			}
			nextStepData.positions.forEach(([r, c, val]) => {			  
			  newBoardState.cells[r][c] = val;
			  if (val === 'x' || val === 'queen') {
				  newBoardState.humans[r][c] = val;
			  } else {
				  newBoardState.humans[r][c] = null;
			  }			  
			});
			if (isWinner) {
				checkForErrosOrVictory(newBoardState.cells)
			}

			return {
				...oldBoardState,
				...newBoardState
			};
		});
      }
    };

    const prevStep = () => {
      if (step > 0) {
		const previousStep = step - 1;
		const currentStepData = solutionSteps[step];
		const newLog = [...log];		
		newLog.pop();
		setLog(newLog);
		setStep(previousStep);
		setIsPaused(false);
		setShowAxes(true);
			
		setBoardState(oldBoardState => {
			const newBoardState = {
				cells: oldBoardState.cells.map(r => [...r]),
				humans: oldBoardState.humans.map(r => [...r]),
				undo: [],
				redo: [],
				needClearBoard: previousStep>0,
			}

			currentStepData.positions.forEach(([r, c]) => {
				  newBoardState.cells[r][c] = null;
				  newBoardState.humans[r][c] = null;
			});
			
			if (currentStepData.removePositions) {
			  currentStepData.removePositions.forEach(([r, c, val]) => {
				  newBoardState.cells[r][c] = val;
				if (val === 'x' || val === 'queen') {
				  newBoardState.humans[r][c] = val;
				} else {
				  newBoardState.humans[r][c] = null;
				}
			  });
			}
			if (isWinner) {
				checkForErrosOrVictory(newBoardState.cells)
			}
			return {
				...oldBoardState,
				...newBoardState
			};					
		});
      }
    };

    const reset = () => {
		setBoardState({
			cells: board.map(row => row.map(() => null)),
			humans: board.map(row => row.map(() => null)),
			autoXMarks: [],
			undo:[],
			redo: [],
			needClearBoard: false
		});

		setIsPaused(false);
		setStep(0);
		setLog([]);
		setCurrentHint(0);
		setIsWinner(false);
		setTime( { hours:0, minutes:0, seconds:0 });
    };

    const clearBoard = () => {		
		setStep(0);
		setLog([]);
		
		setBoardState(oldBoardState => {
			const newBoardState = {
				cells: board.map(row => row.map(() => null)),
				humans: board.map(row => row.map(() => null)),
				autoXMarks: [],
				undo: [...oldBoardState.undo],
				needClearBoard: false,
			}
			
			// Check if need add Undo
			const needAdd = showNeedClearBoard(oldBoardState.cells);
			if (needAdd) {
				addUndo(-1,-1, oldBoardState.cells, oldBoardState.humans, oldBoardState.autoXMarks, newBoardState);
			}
			
			return {
				...oldBoardState,
				...newBoardState
			}
	  });
    };

    const toggleLanguage = () => {
      setLanguage(old => {
		const newLog = log.map(r => [...r]);
		const newLang = old === 'pt' ? 'en' : 'pt'
		newLog.forEach((item, index) => {
				const stepData = solutionSteps[index+1];
				const desc = newLang === 'pt' ? stepData.descPt : stepData.descEn;
				newLog[index] = `${getEmoji(index+1)} ${newLang === 'pt' ? 'Passo' : 'Step'} ${index+1}: ${desc.split('\n')[0]}`
	    });
		setLog(newLog)		
		return newLang;
	  });

    };

    const showNextHint = () => {
      if (currentHint < hints[language].length) {
        setCurrentHint(currentHint + 1);
      }
    };
	
	const dynamicSize =(size) => {
		return `${size*.25}rem`
	}
	
	const hasTouchSupport = () => 'ontouchstart' in document.documentElement;

    const getColorStats = () => {	  
      const colorCounts = {};
      board.forEach((row, r) => {
        row.forEach((color, c) => {
          if (!colorCounts[color]) {
            colorCounts[color] = 0;
          }
          if (boardState.cells[r][c] === 'queen' || boardState.cells[r][c] === 'wrongQueen') {
            colorCounts[color]++;
          }
        });
      });
      
      return { colorCounts };
    };

    const { colorCounts } = getColorStats();
	
    const currentDesc = language === 'pt' ? solutionSteps[step].descPt : solutionSteps[step].descEn;
	
	const getComplementaryColor = (hex) => {
	  hex = hex.replace("#", "");

	  // Converte HEX → RGB (0–1)
	  let r = parseInt(hex.substr(0, 2), 16) / 255;
	  let g = parseInt(hex.substr(2, 2), 16) / 255;
	  let b = parseInt(hex.substr(4, 2), 16) / 255;

	  const max = Math.max(r, g, b);
	  const min = Math.min(r, g, b);
	  const d = max - min;
	  let h = 0, s = 0, l = (max + min) / 2;

	  if (d !== 0) {
		s = d / (1 - Math.abs(2 * l - 1));
		switch (max) {
		  case r: h = ((g - b) / d) % 6; break;
		  case g: h = (b - r) / d + 2; break;
		  case b: h = (r - g) / d + 4; break;
		}
		h = (h * 60 + 360) % 360;
	  }

	  // Caso seja neutra (sem saturação)
	  if (s < 0.1) {
		// Se for muito clara → preto; se muito escura → branco
		return l > 0.6 ? "#000000" : "#FFFFFF";
	  }

	  // Gira o matiz 180° (complementar)
	  h = (h + 180) % 360;

	  // Mantém a saturação, mas ajusta o brilho para aumentar contraste
	  l = l > 0.5 ? l - 0.4 : l + 0.4;
	  l = Math.max(0, Math.min(1, l)); // mantém dentro do range válido

	  // Converte HSL → RGB
	  const c = (1 - Math.abs(2 * l - 1)) * s;
	  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
	  const m = l - c / 2;
	  let [r2, g2, b2] = [0, 0, 0];

	  if (h < 60) [r2, g2, b2] = [c, x, 0];
	  else if (h < 120) [r2, g2, b2] = [x, c, 0];
	  else if (h < 180) [r2, g2, b2] = [0, c, x];
	  else if (h < 240) [r2, g2, b2] = [0, x, c];
	  else if (h < 300) [r2, g2, b2] = [x, 0, c];
	  else [r2, g2, b2] = [c, 0, x];

	  const toHex = (n) =>
		Math.round((n + m) * 255)
		  .toString(16)
		  .padStart(2, "0");

	  return `#${toHex(r2)}${toHex(g2)}${toHex(b2)}`.toUpperCase();
	}

	const highlightBorder = (rowIndex, colIndex) => {
		if (boardState.cells[rowIndex][colIndex] === 'asterisk') {
			let finalStyle = {};
			const boardColor = board[rowIndex][colIndex];
			const borderStyle = `2px solid ${getComplementaryColor(colors[boardColor])}`;				

			if (rowIndex  === 0 || rowIndex - 1 >= 0 && (boardState.cells[rowIndex-1][colIndex] !== 'asterisk' || board[rowIndex-1][colIndex] !== boardColor)) {
				finalStyle["borderTop"] = borderStyle;
			}				 
			if (colIndex === 0 || colIndex - 1 >= 0 && (boardState.cells[rowIndex][colIndex-1] !== 'asterisk' || board[rowIndex][colIndex-1] !== boardColor)) {
				finalStyle["borderLeft"] = borderStyle;
			}
			if (rowIndex === board.length - 1 || rowIndex + 1 < board.length && (boardState.cells[rowIndex+1][colIndex] !== 'asterisk' || board[rowIndex+1][colIndex] !== boardColor)) {
				finalStyle["borderBottom"] = borderStyle;
			}
			if (colIndex === board.length - 1 ||colIndex + 1 < board.length && (boardState.cells[rowIndex][colIndex+1] !== 'asterisk' || board[rowIndex][colIndex+1] !== boardColor)) {
				finalStyle["borderRight"] = borderStyle;
			}
			
			return finalStyle;
		} else {
			return {};
		}		
	}


    return (	
      <div className="grid grid-cols-1 place-items-center p-6 max-w-6xl mx-auto overflow-clip min-h-full min-w-md" onMouseUp={handleMouseUp}>
		{/* Main Title */}
		{<div className="flex justify-between items-center mb-4 w-full">
          <button 
            onClick={() => setShowMenu(!showMenu)}
			arial-label={language === 'pt' ? (showMenu ? 'Ocultar menu' : "Mostrar menu") : (showMenu ? 'Hide menu' : "Show menu")}
			title={language === 'pt' ? (showMenu ? 'Ocultar menu' : "Mostrar menu") : (showMenu ? 'Hide menu' : "Show menu")}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center gap-2"
          >
		    {showMenu ? <ListChevronsDownUp size={24} /> : <ListChevronsUpDown size={24} /> }
          </button>
		  <div className="flex items-center justify-center">
			<img
				title="Queen Puzzle Solver"
				src="/QueenPuzzleSover.png"
				className="w-14 h-14 m-2"
			/>
			<h1 className="text-2xl sm:text-3xl font-bold mx-auto">Queen Puzzle Solver</h1>
		  </div>
          <button 
            onClick={toggleLanguage}
			arial-label={language === 'pt' ? 'English' : 'Português'}
			title={language === 'pt' ? 'Idioma' : 'Language'}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center gap-2"
          >
            <Languages size={20} />
            {language === 'pt' ? 'English' : 'Português'}
          </button>
        </div>}

		{/* Tips buttons */}
		{showMenu && (
        <div className="mb-4 flex gap-2 justify-center flex-wrap">
          <button 
		    title={language === 'pt' ? 'Mostrar dicas' : 'Show hints'}
            onClick={() => setShowHints(!showHints)}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 flex items-center gap-2"
          >
            <Lightbulb size={20} />
            {language === 'pt' ? 'Dicas' : 'Hints'}
          </button>
		  
          <button 
		    title={language === 'pt' ? 'Voltar para etapa anterior da solução passo a passo' : 'Return to the previous step of the step-by-step solution'}
            onClick={prevStep}
            disabled={step === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            ← {language === 'pt' ? 'Voltar' : 'Back'}
          </button>
          <button 
		    title={language === 'pt' ? 'Avançar para próxima etapa da solução passo a passo' : 'Move to the next step of the step-by-step solution'}
            onClick={nextStep}
            disabled={step >= solutionSteps.length - 1}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {language === 'pt' ? 'Próximo Passo' : 'Next Step'} →
          </button>
          <button 
			title={language === 'pt' ? 'Reiniciar tudo' : 'Reset everything'}
            onClick={reset}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
          >
            {language === 'pt' ? 'Resetar' : 'Reset'}
          </button>
        </div>)}

		{/* Hint system */}
        {showMenu && showHints && (
          <div className="mb-4 p-4 bg-yellow-50 rounded border-2 border-yellow-400">
            <div className="flex justify-between items-center mb-2">
              <p className="font-bold text-lg">💡 {language === 'pt' ? 'Sistema de Dicas' : 'Hint System'}</p>
              <button 
                onClick={() => setShowHints(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {hints[language].slice(0, currentHint).map((hint, idx) => (
                <div key={idx} className="p-2 bg-white rounded text-sm">
                  {hint}
                </div>
              ))}
            </div>
            {currentHint < hints[language].length && (
              <button 
                onClick={showNextHint}
                className="mt-3 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 w-full"
              >
                {language === 'pt' ? 'Próxima Dica' : 'Next Hint'} ({currentHint}/{hints[language].length})
              </button>
            )}
            {currentHint === hints[language].length && (
              <p className="mt-3 text-center text-sm text-gray-600">
                {language === 'pt' ? 'Todas as dicas foram reveladas!' : 'All hints revealed!'}
              </p>
            )}
          </div>
        )}

		{/* Solution steps */}
		{ showMenu && (
        <div className="mb-4 p-3 bg-blue-50 rounded border-2 border-blue-300">
          {step > 0 && (
            <p className="font-bold text-lg mb-2">{getEmoji(step)} {language === 'pt' ? 'Passo' : 'Step'} {step} {language === 'pt' ? 'de' : 'of'} {solutionSteps.length - 1}</p>
          )}
          <div className="text-sm whitespace-pre-line">{currentDesc}</div>
        </div>)}

        {showMenu && log.length > 0 && (		  
          <div className="mb-4 p-3 bg-gray-50 rounded max-h-36 overflow-y-auto" ref={divLogHistory}>
            <p className="font-semibold mb-2">{language === 'pt' ? 'Histórico de Passos:' : 'Step History:'}</p>
            <ol className="list-inside space-y-1 text-sm">
              {log.map((entry, idx) => (
                <li key={idx} className="text-gray-700">{entry}</li>
              ))}
            </ol>
          </div>		  
        )}

		{/* Board */}
        <div className="inline-block overflow-x-auto"
			ref={divBoard}
			onMouseDown={handleMouseDown}
			onTouchStart={handleMouseDown}
			onMouseUp={handleMouseUp}
			onTouchEnd={handleMouseUp}
			style = {{
				touchAction: 'none',
				overscrollBehavior: 'contain',
			}}
		>
				
			<div className={`${showAxes ? "ml-8 ": "mb-2 " }text-sm font-semibold flex justify-end`}>
				{/* Undo/Redo Buttons */}
				{<div className="mr-auto flex">
					<button 
						onClick={undoMove}
						arial-label={language === 'pt' ? 'Desfazer' : 'Undo'}
						title={language === 'pt' ? 'Desfazer' : 'Undo'}
						disabled={boardState.undo.length === 0 || isPaused}
						className={`mr-4 px-2 py-2 text-white rounded flex items-center gap-1 ${
							boardState.undo.length === 0 || isPaused ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700"}
						`}
					>
						<Undo2 size={15} />						
					</button>	
					
					{boardState.redo.length > 0 &&(
					<button 
						disabled={isPaused}
						arial-label={language === 'pt' ? 'Refazer' : 'Redo'}
						title={language === 'pt' ? 'Refazer' : 'Redo'}
						onClick={redoMove}
						className={`"mr-auto px-2 py-2 text-white rounded flex items-center gap-1 ${
							isPaused? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700"}`
						}
					>
						<Redo2 size={15} />						
					</button>)}
				</div>}
				
				{/* Clear Board/Timers */}
				{<div className="flex justify-end items-center text-sm font-medium">
					{isWinner ? <span onClick={() => setIsWinner(1)} className="mr-1">🏆🏆🏆</span> : 
					<div className="flex items-center">
						<button
							arial-label={language === 'pt' ? 'Limpar tabuleiro' : 'Clear board'}
							title={language === 'pt' ? 'Limpar tabuleiro' : 'Clear board'}
							disabled={isPaused}
							onClick={clearBoard}
							className={`px-4 py-2 mr-4 text-white rounded ${boardState.needClearBoard ? "" : "hidden"} ${
											isPaused ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
									}`}
						>
							{language === 'pt' ? 'Limpar tabuleiro' : 'Clear board'}
						</button>
					
						<button
							arial-label={language === 'pt' ? (!isPaused ? 'Pausar o jogo' : 'Continuar o jogo') : (!isPaused ? 'Pause the game' : 'Continue the game')}
							title={language === 'pt' ? (!isPaused ? 'Pausar o jogo' : 'Continuar o jogo') : (!isPaused ? 'Pause the game' : 'Continue the game')}
							onClick={()=>setIsPaused(!isPaused)}
						>
							{isPaused ? <CirclePlay className="w-4 h-4 text-green-400 hover:text-green-600 mr-1"/> : <CirclePause className="w-4 h-4 text-red-500 hover:text-red-600 mr-1"/>}
						</button>
						{(showTimer  || isWinner) ? (<Hourglass className="w-3 h-3 text-[#1E3A8A] mr-1" />) : ""}
					</div>}
					{(showTimer || isWinner) ?(
					<h1>
						{time.hours ? `${String(time.hours).padStart(2, "0")}:` : ""}
						{String(time.minutes).padStart(2, "0")}:
						{String(time.seconds).padStart(2, "0")}
					</h1>) : ""}
				</div>}
			</div>
				
		  
			{/* Axes */}
			{showAxes && (
			<div className="flex ml-10">
				{board[0].map((_, colIndex) => (
				<div key={`col-${colIndex}`} className="w-10 h-6 flex items-center justify-center text-sm font-bold text-gray-700">
					{["A","B","C","D","E","F","G","H","I","J","K"][colIndex]}
				</div>
				))}
			</div>)}	
          
			<div className="flex">
				{showAxes && (
				<div className="flex flex-col">
					{board.map((_, rowIndex) => (
						<div key={`row-${rowIndex}`} className="w-8 h-10 flex items-center justify-center text-sm font-bold text-gray-700">{rowIndex+1}</div>
					))}
				</div>)}

				{/* Paused Board */}
				{<div 
					className={`${isPaused ? "" : "hidden"}`}
					style={{ height: dynamicSize(board.length*10+2) }}
				>
					<div className={`border-4 border-gray-800`}>
						<div className="relative top-0 left-0">
							{board.map((row, rowIndex) => (
								<div key={`e-${rowIndex}`} className="flex">
								{row.map((color, colIndex) => (
									<div key={`${rowIndex}-${colIndex}`}
										className="w-10 h-10 border border-gray-400"></div>
								))}
								</div>
							))}
						</div>
					</div>
					
					<div 
						className="relative flex flex-col items-center justify-center"
						style={{
								width: dynamicSize(board.length*10),
								height: dynamicSize(board.length*10),
								top: dynamicSize(-board.length*10),
								left: 0
							  }}
					>
						<div className="w-full h-1/3"></div>
						<div 
							className="grid grid-row-3 grid-col-1 place-items-center justify-center bg-white border-2 border-gray-300 p-4"
							style={{
								width: dynamicSize(board.length/2*10),
							}}
						>
							<MonitorPause size={board.length*9} className="text-[#1E3A8A]"/>
							<div className="font-bold text-xl">{language === 'pt' ? 'Pausado' : 'Paused'}</div>
						</div>
						<div className="flex w-full h-1/3 justify-end items-center">
							<button
								arial-label={language === 'pt' ? (!isPaused ? 'Pausar o jogo' : 'Continuar o jogo') : (!isPaused ? 'Pause the game' : 'Continue the game')}
								title={language === 'pt' ? (!isPaused ? 'Pausar o jogo' : 'Continuar o jogo') : (!isPaused ? 'Pause the game' : 'Continue the game')}
								onClick={() => setIsPaused(false)}
								className="bg-white border-2 border-gray-400"
								style={{
									width: dynamicSize(board.length*2),
									height: dynamicSize(board.length*2),
								}}
							>
							<CirclePlay size={board.length*4} className="mx-auto my-auto hover:text-green-500 text-green-400 m-0"/>
							</button>
						</div>
					</div>
				</div>}

				{/* Main Board */}
				{<div 
					className={`border-4 border-gray-800 ${isPaused ? "hidden" : ""}`} 
					onTouchMove={handleTouchMove}
					style = {{
						touchAction: 'none',
						overscrollBehavior:'contain',
					}}
				>
					{board.map((row, rowIndex) => (
						<div key={rowIndex} className="flex">
							{row.map((color, colIndex) => (								
								<div
									data-div-row={rowIndex}
									data-div-col={colIndex}
									key={`${rowIndex}-${colIndex}`}
									onMouseUp={(event) => event.preventDefault()}
									onMouseLeave={(event) => handleMouseEnterOut(event, rowIndex, colIndex)}
									onMouseEnter={(event) => handleMouseEnterOut(event, rowIndex, colIndex)}

									onContextMenu={preventContextMenu}
									onClick={() => handleClick(rowIndex, colIndex)}
									className={`w-10 h-10 border border-gray-400 flex items-center justify-center cursor-pointer hover:opacity-80 relative`}
									style={{ backgroundColor: colors[color], userSelect: 'none', ...highlightBorder(rowIndex, colIndex) }}
								>
									{showLetter && (
									<span className="absolute top-1 right-1 text-xs opacity-40 font-mono">
										{color}
									</span>)}
									
									{boardState.cells[rowIndex][colIndex] === 'queen' && (
										<Crown className={`w-6 h-6 ${showAnimations ? "animate-grow-up" : ""} ${isWinner === 2 ? "text-yellow-700 animate-wiggle" : "text-yellow-600"}`} fill="currentColor" />
									)}
									{boardState.cells[rowIndex][colIndex] === 'wrongQueen' && (
										<Crown className="animate-rotate-180 w-6 h-6 text-red-600" fill="currentColor" />
									)}
									<div className={`${boardState.cells[rowIndex][colIndex] === 'x' ? "" : "hidden"}`}> 
										<X className={`${showAnimations ? "animate-grow-up" : ""} w-6 h-6 text-red-600`} />
									</div>
									{boardState.cells[rowIndex][colIndex] === 'search' && (
										<Search className="animate-pulse w-6 h-6 text-[#1E3A8A]" />
									)}
									{boardState.cells[rowIndex][colIndex] === 'asterisk' && (
										<div className="animate-invert-x relative w-7 h-7 text-[#1E3A8A]">
										👀
										</div>										
									)}
									{boardState.cells[rowIndex][colIndex] === 'potencialX' && (
										<MessageCircleX className="animate-scale-70 w-6 h-6 text-[#D32F2F]" />
									)}					  
								</div>
							))}
						</div>
					))}
				</div>}
			</div>
		</div>
		
		{/* Settings */}
		{<div className="mt-4 p-3 bg-blue-50 rounded">
			<p className="text-sm font-semibold mb-2">{language === 'pt' ? 'Configurações:' : 'Settings:'}</p>
			<div className="grid grid-cols-2 gap-2 text-xs">
				<div className="flex gap-2">
					<label className="flex items-center cursor-pointer">
						<input
							arial-label={language === 'pt' ? (autoAddX ? 'Deastivar colocar os ❌ automaticamente' : 'Ativar colocar os ❌ automaticamente') : (autoAddX ? "Disable auto-place ❌'s" : "Enable auto-place ❌'s")}
							title={language === 'pt' ? (autoAddX ? 'Deastivar colocar os ❌ automaticamente' : 'Ativar colocar os ❌ automaticamente') : (autoAddX ? "Disable auto-place ❌'s" : "Enable auto-place ❌'s")}
							type="checkbox"
							className="sr-only"
							checked={autoAddX}
							onChange={() => setAutoAddX(!autoAddX)}
						/>
						<div
							className={`w-8 h-4 flex items-center rounded-full p-1 ${
								autoAddX ? "bg-blue-500" : "bg-gray-300"
							}`}
						>
							<div
								className={`bg-white w-2 h-2 rounded-full shadow-md transform duration-300 ${
									autoAddX ? "translate-x-4" : ""
								}`}
							></div>
						</div>			  
					</label>
					<label className="flex items-center cursor-pointer">{language === 'pt' ? 'Colocar os ❌ automaticamente' : "Auto-place ❌'s" }</label>
				</div>
				
				<div className="flex gap-2">
					<label className="flex items-center cursor-pointer">
						<input
							arial-label={language === 'pt' ? (showLetter ? 'Mostrar a letra da cor do bloco' : 'Mostrar a letra da cor do bloco') : (showLetter ? "Hide the block color letter" : "Show the block color letter")}
							title={language === 'pt' ? (showLetter ? 'Mostrar a letra da cor do bloco' : 'Mostrar a letra da cor do bloco') : (showLetter ? "Hide the block color letter" : "Show the block color letter")}
							type="checkbox"
							className="sr-only"
							checked={showLetter}
							onChange={() => setShowLetter(!showLetter)}
						/>
						<div
							className={`w-8 h-4 flex items-center rounded-full p-1 ${
								showLetter ? "bg-blue-500" : "bg-gray-300"
							}`}
						>
							<div
								className={`bg-white w-2 h-2 rounded-full shadow-md transform duration-300 ${
									showLetter ? "translate-x-4" : ""
								}`}
							></div>			
						</div>			  
					</label>
					<label className="flex items-center cursor-pointer">{language === 'pt' ? "Mostrar a letra da cor do bloco" : 'Show the block color letter' }</label>
				</div>
				
				<div className="flex gap-2">
					<label className="flex items-center cursor-pointer">
						<input
							arial-label={language === 'pt' ? (showAxes ? 'Ocultar eixos' : 'Mostrar eixos') : (showAxes ? "Hide axes" : "Show axes")}
							title={language === 'pt' ? (showAxes ? 'Ocultar eixos' : 'Mostrar eixos') : (showAxes ? "Hide axes" : "Show axes")}
							type="checkbox"
							className="sr-only"
							checked={showAxes}
							onChange={() => setShowAxes(!showAxes)}
						/>
						<div
							className={`w-8 h-4 flex items-center rounded-full p-1 ${
							  showAxes ? "bg-blue-500" : "bg-gray-300"
							}`}
						>
							<div
								className={`bg-white w-2 h-2 rounded-full shadow-md transform duration-300 ${
								showAxes ? "translate-x-4" : ""
							}`}
							></div>
						</div>
					</label>
					<label className="flex items-center cursor-pointer">{language === 'pt' ? "Mostrar eixos" : 'Show axes' }</label>
				</div>
				
				<div className="flex gap-2">
					<label className="flex items-center cursor-pointer">
						<input
							arial-label={language === 'pt' ? (showTimer ? 'Ocultar tempo' : 'Mostrar tempo') : (showTimer ? "Hide timer" : "Show timer")}
							title={language === 'pt' ? (showTimer ? 'Ocultar tempo' : 'Mostrar tempo') : (showTimer ? "Hide timer" : "Show timer")}
							type="checkbox"
							className="sr-only"
							checked={showTimer}
							onChange={() => setShowTimer(!showTimer)}
						/>
						<div
							className={`w-8 h-4 flex items-center rounded-full p-1 ${
							  showTimer ? "bg-blue-500" : "bg-gray-300"
							}`}
						>
							<div
								className={`bg-white w-2 h-2 rounded-full shadow-md transform duration-300 ${
									showTimer ? "translate-x-4" : ""
								}`}
							></div>			
						</div>			  
					</label>
					<label className="flex items-center cursor-pointer">{language === 'pt' ? "Mostrar tempo" : 'Show timer' }</label>
				</div>
				
				<div className="flex gap-2">
					<label className="flex items-center cursor-pointer">
						<input
							arial-label={language === 'pt' ? (showAnimations ? 'Ocultar animações' : 'Mostrar animações') : (showAnimations ? "Hide animations" : "Show animations")}
							title={language === 'pt' ? (showAnimations ? 'Ocultar animações' : 'Mostrar animações') : (showAnimations ? "Hide animations" : "Show animations")}
							type="checkbox"
							className="sr-only"
							checked={showAnimations}
							onChange={() => setShowAnimations(!showAnimations)}
						/>
						<div
							className={`w-8 h-4 flex items-center rounded-full p-1 ${
							  showAnimations ? "bg-blue-500" : "bg-gray-300"
							}`}
						>
							<div
								className={`bg-white w-2 h-2 rounded-full shadow-md transform duration-300 ${
									showAnimations ? "translate-x-4" : ""
								}`}
							></div>			
						</div>			  
					</label>
					<label className="flex items-center cursor-pointer">{language === 'pt' ? "Mostrar animações" : 'Show animations' }</label>
				</div>				
				
				{hasTouchSupport() && (
				<div className="flex gap-2">
					<label className="flex items-center cursor-pointer">
						<input
							arial-label={language === 'pt' ? (addXOnHover ? "Marcar com ❌ ao deslizar o dedo na tela" : "Remover o ❌ ao deslizar o dedo na tela") : (addXOnHover ? 'Mark with ❌ by sliding your finger on the screen' : 'Remove the ❌ by sliding your finger on the screen') }
							title={language === 'pt' ? (addXOnHover ? "Marcar com ❌ ao deslizar o dedo na tela" : "Remover o ❌ ao deslizar o dedo na tela") : (addXOnHover ? 'Mark with ❌ by sliding your finger on the screen' : 'Remove the ❌ by sliding your finger on the screen') }
							type="checkbox"
							className="sr-only"
							checked={addXOnHover}
							onChange={() => setAddXOnHover(!addXOnHover)}
						/>
						<div
							className={`w-8 h-4 flex items-center rounded-full p-1 ${
							  addXOnHover ? "bg-blue-500" : "bg-red-500"
							}`}
						>
							<div
								className={`bg-white w-2 h-2 rounded-full shadow-md transform duration-300 ${
								addXOnHover ? "translate-x-4" : ""
							}`}
							></div>			
						</div>			  
					</label>
					<label className="flex items-center cursor-pointer">{language === 'pt' ? (addXOnHover ? "Marcar com ❌ ao deslizar o dedo na tela" : "Remover o ❌ ao deslizar o dedo na tela") : (addXOnHover ? 'Mark with ❌ by sliding your finger on the screen' : 'Remove the ❌ by sliding your finger on the screen') }</label>
				</div>)}
			</div>
		</div>}
		
		{/* Queen statistics */}
        <div className="mt-4 p-3 bg-blue-50 rounded">
          <p className="text-sm font-semibold mb-2">{language === 'pt' ? 'Legenda de Cores:' : 'Color Legend:'}</p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {Object.entries(colors).map(([letter, color]) => (
              <div key={letter} className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded border border-gray-400"
                  style={{ backgroundColor: color }}
                />
                <span>{letter}: {colorCounts[letter] || 0}/1 👑</span>
              </div>
            ))}
          </div>
        </div>

		{/* How to play */}
        <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
          <p className="font-semibold mb-2">🎮 {language === 'pt' ? 'Como jogar:' : 'How to play:'}</p>
          <ul className="list-disc list-inside space-y-1">
		    <li>{language === 'pt' ? 'Você vence o jogo quando cada linha, coluna e região de cor contém exatamente uma 👑, sem que duas 👑 fiquem lado a lado, nem mesmo na diagonal' : 'Win by placing exactly one 👑 in each row, column, and color region, without any two 👑 touching — even diagonally.'}</li>
			{hasTouchSupport() && (<li>{language === 'pt' ? `Toque duas vezes para colocar uma rainha 👑` : `Tap twice to place a queen 👑`}</li>)}
            {hasTouchSupport() && (<li>{language === 'pt' ? `Toque uma vez para marcar com ❌` : `Tap once to mark with ❌`}</li>)}
            {hasTouchSupport() && (<li>{language === 'pt' ? `Toque três vezes para limpar a célula` : `Tap three times to clear the cell`}</li>)}
			{hasTouchSupport() && (<li>{language === 'pt' ? `Deslize o dedo para marcar ou remover ❌, conforme suas configurações.` : `Slide your finger to add or remove ❌, based on your settings.`}</li>)}
			{!hasTouchSupport() && (<li>{language === 'pt' ? 'Clique duas vezes para colocar uma rainha 👑' : 'Click twice to place a queen 👑'}</li>)}
            {!hasTouchSupport() && (<li>{language === 'pt' ? 'Clique uma vez para marcar com ❌' : 'Click once to mark with ❌'}</li>)}
            {!hasTouchSupport() && (<li>{language === 'pt' ? 'Clique três vezes para limpar a célula' : 'Click three times to clear the cell'}</li>)}
			{!hasTouchSupport() && (<li>{language === 'pt' ? 'Passe o mouse sobre as células com o botão esquerdo do mouse pressionado para marcá-las com um ❌.' : 'Hover over cells with the left mouse button pressed to mark them with an ❌.'}</li>)}
			{!hasTouchSupport() && (<li>{language === 'pt' ? 'Passe o mouse sobre as células com o botão direito do mouse pressionado para remover o ❌.' : 'Hover over cells with the right mouse button pressed to remove ❌.'}</li>)}		
          </ul>
        </div>

		{/* Dialog Victory */}
		{Number(isWinner)===1 && (
		  <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
			<div className="bg-gradient-to-tr from-[#FFF8DC] via-[#FFD700] to-[#B8860B] 
							rounded-2xl shadow-2xl p-8 w-96 text-center">
			  
			  {/* Títulos */}
			  <h2 className="text-2xl font-extrabold text-white drop-shadow-md">🎉</h2>
			  <h2 className="text-2xl font-extrabold text-white drop-shadow-md">{language === 'pt' ? 'Incrível!' : 'Amazing!'}</h2>
			  <h2 className="text-xl font-bold text-white mb-6 drop-shadow-md">{language === 'pt' ? 'Você venceu!' : 'You win!'}</h2>
			  
			  {/* Caixa de tempo */}
			  <div className="bg-white/90 p-4 w-full text-gray-800 mb-6 rounded-lg shadow-md">
				<div className="text-2xl font-mono font-bold tracking-wider">
				  {String(time.hours).padStart(2, "0")}:
				  {String(time.minutes).padStart(2, "0")}:
				  {String(time.seconds).padStart(2, "0")}
				</div>
				<div className="text-sm uppercase tracking-wide text-gray-500 mt-1">
				  {language === 'pt' ? 'Tempo de resolução!' : 'Solve Time'}
				</div>
			  </div>

			  {/* Botão */}
			  <button
				onClick={() => setIsWinner(2)}
				className="px-6 py-3 text-white font-semibold rounded-xl
						   bg-gradient-to-br from-[#C084FC] via-[#A855F7] to-[#6B21A8]
						   shadow-lg hover:scale-105 transform transition-all"
			  >
				{language === 'pt' ? 'Aqui está seu 🏆' : "Here's your 🏆"}
			  </button>
			</div>
		  </div>
		)}
	</div>
	  	 
    );
};

export default QueenPuzzle