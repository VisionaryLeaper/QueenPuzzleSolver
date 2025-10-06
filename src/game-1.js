export default {
	board: [
      ['J', 'J', 'J', 'J', 'C', 'C', 'C', 'C', 'C', 'C', 'C'],
      ['J', 'C', 'C', 'C', 'C', 'A', 'A', 'A', 'A', 'A', 'I'],
      ['J', 'J', 'J', 'A', 'A', 'A', 'D', 'A', 'A', 'I', 'I'],
      ['J', 'J', 'J', 'J', 'A', 'A', 'D', 'D', 'D', 'B', 'I'],
      ['J', 'J', 'J', 'E', 'E', 'E', 'E', 'B', 'B', 'B', 'I'],
      ['J', 'K', 'J', 'J', 'J', 'J', 'E', 'E', 'B', 'E', 'I'],
      ['K', 'K', 'G', 'G', 'J', 'J', 'H', 'E', 'E', 'E', 'E'],
      ['K', 'K', 'K', 'G', 'G', 'H', 'H', 'H', 'F', 'G', 'E'],
      ['K', 'K', 'G', 'G', 'H', 'H', 'F', 'F', 'F', 'G', 'E'],
      ['K', 'G', 'G', 'G', 'G', 'H', 'G', 'G', 'F', 'G', 'E'],
      ['K', 'K', 'K', 'K', 'G', 'G', 'G', 'G', 'G', 'G', 'E']
    ],
  
    colors: {
      A: '#C5A3D0', B: '#F4B36C', C: '#A7D8F0', D: '#B8E6B8', E: '#DDDDDD',
      F: '#FFABAB', G: '#F4DFB6', H: '#C9A96E', I: '#E3C5E8', J: '#B5CC9C',
      K: '#7FC7D9'
    },
	
	hints: {
      pt: [
        "💡 Dica 1: Criar essa tabuleiro não foi simples, mas se baseou nas lógicas básicas, tentando ocultá-las para aumentar a dificuldade.",
        "💡 Dica 2: O grande desafio dessa fase é localizar células que podem ser eliminadas e permitir a aplicação das lógicas básicas.",
        "💡 Dica 3: A lógica básica inicial é que se X linhas/colunas tiverem apenas X cores, demais cores fora dessas linhas/colunas podem ser eliminadas",
        "💡 Dica 4: Preste atenção especial nas linhas 7-11. Há um padrão interessante ali...",
        "💡 Dica 5: Conte quantas cores diferentes existem em um grupo de linhas ou colunas consecutivas.",
        "💡 Dica 6: As posições E7 e F7 são chave para resolver este puzzle.",
      ],
      en: [
        "💡 Hint 1: Creating this board was not simple, but it was based on basic logic, trying to hide it to increase the difficulty.",
        "💡 Hint 2: The big challenge of this phase is to locate cells that can be eliminated and allow the application of basic logic.",
        "💡 Hint 3: The basic initial logic is that if X rows/columns have only X colors, other colors outside of those rows/columns can be eliminated.",
        "💡 Hint 4: Pay special attention to rows 7-11. There's an interesting pattern there...",
        "💡 Hint 5: Count how many different colors exist in a group of consecutive rows or columns.",
        "💡 Hint 6: Positions E7 and F7 are key to solving this puzzle.",
      ]
    },
	
	solutionSteps: [
      {
        descPt: "🎯 Início\nEssa fase foi criada para ser muito difícil 🥶, sendo necessário uma visão além do alcance 👀 para resolvê-la de forma lógica 😀!\nA ideia é não ter eliminações triviais. Se quiser a solução, basta seguir esse passo a passo. Se preferir, há algumas dicas para ajudar a resolver o desafio.",
        descEn: "🎯 Start\nThis stage was created to be very difficult 🥶, requiring Sigh Beyond Sight 👀 to solve it logically 😀!\nThe idea is to have no trivial eliminations. If you want the solution, just follow this step by step. If you prefer, there are some helpful hints to help you solve the challenge.",
        positions: [],
      },
      {
        descPt: "Olhe as linhas de 7 a 11. São exatamente 6 cores para 5 linhas.",
        descEn: "Look at rows 7 to 11. There are exactly 6 colors for 5 rows.",
        positions: [6,7,8,9,10].map(i=> [0,1,2,3,4,5,6,7,8,9,10].map(j => [i, j, 'asterisk'])).flat(),
      },
      {
        descPt: "Repare que se fosse possível eliminar as células E7 e F7, teríamos 5 cores para 5 linhas.",
        descEn: "Notice that if we could eliminate cells E7 and F7, we would have 5 colors for 5 rows.",
        removePositions: [6,7,8,9,10].map(i=> [0,1,2,3,4,5,6,7,8,9,10].map(j => [i, j, 'asterisk'])).flat(),
        positions: [[6, 4, 'search'],[6, 5, 'search']]
      },
      {
        descPt: "Aplicando a rainha em qualquer uma dessas células, iríamos eliminar todo o bloco da cor J (verde oliva).",
        descEn: "Placing the queen in any of these cells would eliminate the entire J (olive green) color block.",
        positions: [
          [0, 0, 'potencialX'], [0, 1, 'potencialX'], [0, 2, 'potencialX'], [0, 3, 'potencialX'],
          [1, 0, 'potencialX'],
          [2, 0, 'potencialX'], [2, 1, 'potencialX'], [2, 2, 'potencialX'],
          [3, 0, 'potencialX'], [3, 1, 'potencialX'], [3, 2, 'potencialX'], [3, 3, 'potencialX'],
          [4, 0, 'potencialX'], [4, 1, 'potencialX'], [4, 2, 'potencialX'],
          [5, 0, 'potencialX'], [5, 2, 'potencialX'], [5, 3, 'potencialX'], [5, 4, 'potencialX'], [5, 5, 'potencialX']
        ],
      },
      {
        descPt: "Isso obrigaria as cores dos blocos C (azul claro), K (azul médio) e G (bege claro) pertencerem às linhas A, B, C.",
        descEn: "This would force the colors of blocks C (light blue), K (medium blue) and G (light beige) to belong to rows A, B, C.",
        positions: [
          [1, 1, 'asterisk'], [1, 2, 'asterisk'], [5, 1, 'asterisk'],
          [6, 0, 'asterisk'], [6, 1, 'asterisk'], [6, 2, 'asterisk'],
          [7, 0, 'asterisk'], [7, 1, 'asterisk'], [7, 2, 'asterisk'],
          [8, 0, 'asterisk'], [8, 1, 'asterisk'], [8, 2, 'asterisk'],
          [9, 0, 'asterisk'], [9, 1, 'asterisk'], [9, 2, 'asterisk'],
          [10, 0, 'asterisk'], [10, 1, 'asterisk'], [10, 2, 'asterisk']
        ],
      },
      {
        descPt: "O que eliminaria todas as posições da linha 1.",
        descEn: "Which would eliminate all positions from row 1.",
        positions: [
          [1, 3, 'potencialX'], [1, 4, 'potencialX'],
          [0, 4, 'potencialX'], [0, 5, 'potencialX'], [0, 6, 'potencialX'], [0, 7, 'potencialX'], [0, 8, 'potencialX'], [0, 9, 'potencialX'], [0, 10, 'potencialX']
        ],
      },
      {
        descPt: "Portanto, podemos eliminar com segurança as posições E7 e F7.",
        descEn: "Therefore, we can safely eliminate positions E7 and F7.",
        removePositions: [
          [0, 0, 'potencialX'], [0, 1, 'potencialX'], [0, 2, 'potencialX'], [0, 3, 'potencialX'], [0, 4, 'potencialX'], [0, 5, 'potencialX'], [0, 6, 'potencialX'], [0, 7, 'potencialX'], [0, 8, 'potencialX'], [0, 9, 'potencialX'], [0, 10, 'potencialX'],
          [1, 0, 'potencialX'], [1, 3, 'potencialX'], [1, 4, 'potencialX'], [1, 1, 'asterisk'], [1, 2, 'asterisk'],
          [2, 0, 'potencialX'], [2, 1, 'potencialX'], [2, 2, 'potencialX'],
          [3, 0, 'potencialX'], [3, 1, 'potencialX'], [3, 2, 'potencialX'], [3, 3, 'potencialX'],
          [4, 0, 'potencialX'], [4, 1, 'potencialX'], [4, 2, 'potencialX'],
          [5, 1, 'asterisk'], [5, 0, 'potencialX'], [5, 2, 'potencialX'], [5, 3, 'potencialX'], [5, 4, 'potencialX'], [5, 5, 'potencialX'],
          [6, 4, 'search'], [6, 5, 'search'],
          [6, 0, 'asterisk'], [6, 1, 'asterisk'], [6, 2, 'asterisk'],
          [7, 0, 'asterisk'], [7, 1, 'asterisk'], [7, 2, 'asterisk'],
          [8, 0, 'asterisk'], [8, 1, 'asterisk'], [8, 2, 'asterisk'],
          [9, 0, 'asterisk'], [9, 1, 'asterisk'], [9, 2, 'asterisk'],
          [10, 0, 'asterisk'], [10, 1, 'asterisk'], [10, 2, 'asterisk']
        ],
        positions: [[6, 4, 'x'], [6, 5, 'x']],
      },
      {
        descPt: "Aplicando a regra de 5 cores para 5 linhas, podemos eliminar as cores do bloco E (cinza claro) e K (azul médio) que estão fora das linhas de 7 a 11.",
        descEn: "Applying the rule of 5 colors for 5 rows, we can eliminate the E (light gray) and K (medium blue) block colors that are outside rows 7 to 11.",
        positions: [
          [4, 3, 'x'], [4, 4, 'x'], [4, 5, 'x'], [4, 6, 'x'],
          [5, 1, 'x'], [5, 6, 'x'], [5, 7, 'x'], [5, 9, 'x']
        ],
      },
      {
        descPt: "Observe agora que temos 5 blocos de cores entre as colunas G e K.",
        descEn: "Now observe that we have 5 color blocks between columns G and K.",
        positions: [
          [2, 6, 'asterisk'], [3, 6, 'asterisk'], [8, 6, 'asterisk'],
          [3, 7, 'asterisk'], [4, 7, 'asterisk'], [6, 7, 'asterisk'], [8, 7, 'asterisk'],
          [3, 8, 'asterisk'], [4, 8, 'asterisk'], [5, 8, 'asterisk'], [6, 8, 'asterisk'], [7, 8, 'asterisk'], [8, 8, 'asterisk'], [9, 8, 'asterisk'],
          [2, 9, 'asterisk'], [3, 9, 'asterisk'], [4, 9, 'asterisk'], [6, 9, 'asterisk'],
          [1, 10, 'asterisk'], [2, 10, 'asterisk'], [3, 10, 'asterisk'], [4, 10, 'asterisk'], [5, 10, 'asterisk'], [6, 10, 'asterisk'], [7, 10, 'asterisk'], [8, 10, 'asterisk'], [9, 10, 'asterisk'], [10, 10, 'asterisk']
        ],
      },
      {
        descPt: "Isso permite a eliminação das demais cores fora desses 5 blocos.",
        descEn: "This allows elimination of other colors outside these 5 blocks.",
        removePositions: [
          [2, 6, 'asterisk'], [3, 6, 'asterisk'], [8, 6, 'asterisk'],
          [3, 7, 'asterisk'], [4, 7, 'asterisk'], [6, 7, 'asterisk'], [8, 7, 'asterisk'],
          [3, 8, 'asterisk'], [4, 8, 'asterisk'], [5, 8, 'asterisk'], [6, 8, 'asterisk'], [7, 8, 'asterisk'], [8, 8, 'asterisk'], [9, 8, 'asterisk'],
          [2, 9, 'asterisk'], [3, 9, 'asterisk'], [4, 9, 'asterisk'], [6, 9, 'asterisk'],
          [1, 10, 'asterisk'], [2, 10, 'asterisk'], [3, 10, 'asterisk'], [4, 10, 'asterisk'], [5, 10, 'asterisk'], [6, 10, 'asterisk'], [7, 10, 'asterisk'], [8, 10, 'asterisk'], [9, 10, 'asterisk'], [10, 10, 'asterisk']
        ],
        positions: [
          [0, 6, 'x'], [1, 6, 'x'], [6, 6, 'x'], [7, 6, 'x'], [9, 6, 'x'], [10, 6, 'x'],
          [0, 7, 'x'], [1, 7, 'x'], [2, 7, 'x'], [7, 7, 'x'], [9, 7, 'x'], [10, 7, 'x'],
          [0, 8, 'x'], [1, 8, 'x'], [2, 8, 'x'], [10, 8, 'x'],
          [0, 9, 'x'], [1, 9, 'x'], [7, 9, 'x'], [8, 9, 'x'], [9, 9, 'x'], [10, 9, 'x'],
          [0, 10, 'x']
        ],
      },
      {
        descPt: "Olhe agora a posição F2. Uma rainha nessa posição eliminaria todo o bloco da cor C (azul claro).",
        descEn: "Now look at position F2. A queen in this position would eliminate the entire C (light blue) color block.",
        positions: [[1, 5, 'search'],
					...[4,5].map(c => [0, c, 'potencialX']), // Linha 0 - 1
					...[1,2,3,4].map(c => [1, c, 'potencialX']), // Linha 1 - 2
				   ],
      },
      {
        descPt: "Podemos eliminar agora F2. Olhe agora os blocos de cores A (lilás claro) e D (verde claro).",
        descEn: "We can now eliminate F2. Now look at color blocks A (light lilac) and D (light green).",
        removePositions: [[1, 5, 'search'],
					...[4,5].map(c => [0, c, 'potencialX']), // Linha 0 - 1
					...[1,2,3,4].map(c => [1, c, 'potencialX']), // Linha 1 - 2
				   ],
        positions: [[1, 5, 'x'],
					...[3,4,5,6].map(c => [2, c, 'asterisk']), // Linha 2 - 3
					...[4,5,6,7,8].map(c => [3, c, 'asterisk']), // Linha 3 - 4
		],
      },
      {
        descPt: "Restam apenas os blocos de cores A (lilás claro) e D (verde claro) nas linhas 3 e 4. Demais cores desse bloco podem ser eliminadas.",
        descEn: "Only color blocks A (light lilac) and D (light green) remain in rows 3 and 4. Other colors in this block can be eliminated.",
        removePositions: [
					...[3,4,5,6].map(c => [2, c, 'asterisk']), // Linha 2 - 3
					...[4,5,6,7,8].map(c => [3, c, 'asterisk']), // Linha 3 - 4
		],
        positions: [
          [2, 0, 'x'], [2, 1, 'x'], [2, 2, 'x'], [2, 9, 'x'], [2, 10, 'x'],
          [3, 0, 'x'], [3, 1, 'x'], [3, 2, 'x'], [3, 3, 'x'], [3, 9, 'x'], [3, 10, 'x']
        ],
      },
      {
        descPt: "O bloco de cor I (lavanda) está apenas na coluna K. Demais cores dessa coluna podem ser eliminadas.",
        descEn: "The I (lavender) color block is only in column K. Other colors in this column can be eliminated.",
        positions: [[6, 10, 'x'], [7, 10, 'x'], [8, 10, 'x'], [9, 10, 'x'], [10, 10, 'x']],
      },
      {
        descPt: "O bloco de cor E (cinza claro) está apenas na linha 7. Demais cores dessa linha podem ser eliminadas.",
        descEn: "The E (light gray) color block is only in row 7. Other colors in this row can be eliminated.",
        positions: [[6, 0, 'x'], [6, 1, 'x'], [6, 2, 'x'], [6, 3, 'x']],
      },
      {
        descPt: "Olhe agora I6 e I8. Elas eliminam todas as posições do bloco E (cinza claro).",
        descEn: "Now look at I6 and I8. They eliminate all the positions in the E (light gray) block.",
        positions: [[5, 8, 'search'], [7, 8, 'search'],
					[6, 7, 'potencialX'],[6, 8, 'potencialX'],[6, 9, 'potencialX'],
				   ],
      },
      {
        descPt: "Portanto I6 e I8 podem ser eliminadas por fazerem fronteira com as 3 opções do bloco E (cinza claro).",
        descEn: "Therefore I6 and I8 can be eliminated as they border the 3 options in block E (light grey).",
        removePositions: [[5, 8, 'search'], [7, 8, 'search'],
					[6, 7, 'potencialX'],[6, 8, 'potencialX'],[6, 9, 'potencialX'],
				   ],
        positions: [[5, 8, 'x'], [7, 8, 'x']],
      },
      {
        descPt: "O bloco de cor B (laranja) está apenas na linha 5. Demais cores dessa linha podem ser eliminadas.",
        descEn: "The B (orange) color block is only in row 5. Other colors in this row can be eliminated.",
        positions: [[4, 0, 'x'], [4, 1, 'x'], [4, 2, 'x'], [4, 10, 'x']],
      },
      {
        descPt: "Olhe agora a posição K6. Uma rainha lá eliminaria as posições J5 e J7. Assim não teríamos mais opções na coluna J.",
        descEn: "Now look at position K6. A queen there would eliminate positions J5 and J7. Thus we would have no more options in column J.",
        positions: [[5, 10, 'search'], [4, 9, 'potencialX'], [6, 9, 'potencialX']],
      },
      {
        descPt: "Eliminamos assim a posição K6, sobrando a rainha em K2, eliminando demais posições/cores da linha 2.",
        descEn: "We thus eliminate position K6, leaving the queen at K2, eliminating other positions/colors from row 2.",
        removePositions: [[5, 10, 'search'], [4, 9, 'potencialX'], [6, 9, 'potencialX']],
        positions: [
          [5, 10, 'x'], [1, 10, 'queen'],
          [1, 0, 'x'], [1, 1, 'x'], [1, 2, 'x'], [1, 3, 'x'], [1, 4, 'x'], [1, 5, 'x']
        ],
      },
      {
        descPt: "O bloco de cor C (azul claro) está agora apenas na linha 1. Demais cores dessa linha podem ser eliminadas.",
        descEn: "The C (light blue) color block is now only in row 1. Other colors in this row can be eliminated.",
        positions: [[0, 0, 'x'], [0, 1, 'x'], [0, 2, 'x'], [0, 3, 'x']],
      },
      {
        descPt: "As colunas A, B e C agora têm somente 3 blocos de cores.",
        descEn: "Columns A, B and C now have only 3 color blocks.",
        positions: [
          [5, 0, 'asterisk'], [7, 0, 'asterisk'], [8, 0, 'asterisk'], [9, 0, 'asterisk'], [10, 0, 'asterisk'],
          [7, 1, 'asterisk'], [8, 1, 'asterisk'], [9, 1, 'asterisk'], [10, 1, 'asterisk'],
          [5, 2, 'asterisk'], [7, 2, 'asterisk'], [8, 2, 'asterisk'], [9, 2, 'asterisk'], [10, 2, 'asterisk']
        ],
      },
      {
        descPt: "Podemos eliminar então as cores dos blocos J (verde oliva), K (azul médio) e G (bege claro) que não estão entre as colunas A e C.",
        descEn: "We can then eliminate the colors of blocks J (olive green), K (medium blue) and G (light beige) that are not between columns A and C.",
        removePositions: [
          [5, 0, 'asterisk'], [7, 0, 'asterisk'], [8, 0, 'asterisk'], [9, 0, 'asterisk'], [10, 0, 'asterisk'],
          [7, 1, 'asterisk'], [8, 1, 'asterisk'], [9, 1, 'asterisk'], [10, 1, 'asterisk'],
          [5, 2, 'asterisk'], [7, 2, 'asterisk'], [8, 2, 'asterisk'], [9, 2, 'asterisk'], [10, 2, 'asterisk']
        ],
        positions: [
          [5, 3, 'x'], [7, 3, 'x'], [8, 3, 'x'], [9, 3, 'x'], [10, 3, 'x'],
          [5, 4, 'x'], [7, 4, 'x'], [9, 4, 'x'], [10, 4, 'x'],
          [5, 5, 'x'], [10, 5, 'x']
        ],
      },
      {
        descPt: "Na linha 11, temos apenas o bloco de cor K (azul médio). Podemos eliminar essa cor nas demais posições.",
        descEn: "In row 11, we only have the K (medium blue) color block. We can eliminate this color in other positions.",
        positions: [[7, 0, 'x'], [8, 0, 'x'], [9, 0, 'x'], [7, 1, 'x'], [8, 1, 'x'], [7, 2, 'x']],
      },
      {
        descPt: "As 3 opções do bloco de cor K (azul médio) são vizinhas da posição B10, o que nos permite eliminar essa posição.",
        descEn: "The 3 options of the K (medium blue) color block are neighbors of position B10, which allows us to eliminate this position.",
        positions: [[9, 1, 'x']],
      },
      {
        descPt: "O bloco de cor G (bege claro) está apenas na coluna C. Demais cores dessa coluna podem ser eliminadas.",
        descEn: "The G (light beige) color block is only in column C. Other colors in this column can be eliminated.",
        positions: [[5, 2, 'x'], [10, 2, 'x']],
      },
      {
        descPt: "Podemos colocar a rainha na posição A6, última opção do bloco de cor J (verde oliva), o que permite eliminar demais cores da coluna A.",
        descEn: "We can place the queen at position A6, last option of color block J (olive green), which allows us to eliminate other colors from column A.",
        positions: [[5, 0, 'queen'], [10, 0, 'x']],
      },
      {
        descPt: "Podemos colocar a rainha na posição B11, última opção do bloco de cor K (azul médio), o que permite eliminar seus vizinhos.",
        descEn: "We can place the queen at position B11, last option of color block K (medium blue), which allows us to eliminate its neighbors.",
        positions: [[10, 1, 'queen'], [9, 2, 'x']],
      },
      {
        descPt: "Podemos colocar a rainha na posição C9, última opção do bloco de cor G (bege claro), o que permite eliminar demais posições da linha 9.",
        descEn: "We can place the queen at position C9, last option of color block G (light beige), which allows us to eliminate other positions from row 9.",
        positions: [[8, 2, 'queen'], [8, 4, 'x'], [8, 5, 'x'], [8, 6, 'x'], [8, 7, 'x'], [8, 8, 'x']],
      },
      {
        descPt: "Podemos colocar a rainha na posição F8, pois é a única opção da linha 8. Isso elimina demais posições da coluna F.",
        descEn: "We can place the queen at position F8, as it is the only option for row 8. This eliminates other positions from column F.",
        positions: [[7, 5, 'queen'], [0, 5, 'x'], [2, 5, 'x'], [3, 5, 'x'], [9, 5, 'x']],
      },
      {
        descPt: "Para o bloco de cor C (azul claro), só resta E1. Colocando a rainha lá, eliminamos demais cores da coluna E.",
        descEn: "For color block C (light blue), only E1 remains. Placing the queen there, we eliminate other colors from column E.",
        positions: [[0, 4, 'queen'], [2, 4, 'x'], [3, 4, 'x']],
      },
      {
        descPt: "Para o bloco de cor A (lilás claro), só resta D3. Colocando a rainha lá, eliminamos demais cores da linha 3.",
        descEn: "For color block A (light lilac), only D3 remains. Placing the queen there, we eliminate other colors from row 3.",
        positions: [[2, 3, 'queen'], [2, 6, 'x']],
      },
      {
        descPt: "A posição G4 é a única opção da coluna G. Podemos eliminar seus vizinhos agora e demais posições da linha 4.",
        descEn: "Position G4 is the only option for column G. We can now eliminate its neighbors and other positions from row 4.",
        positions: [[3, 6, 'queen'], [3, 8, 'x'], [3, 7, 'x'], [4, 7, 'x']],
      },
      {
        descPt: "Podemos colocar a rainha na posição H7, pois é a única opção da coluna H. Isso elimina demais posições da linha 7.",
        descEn: "We can place the queen at position H7, as it is the only option for column H. This eliminates other positions from row 7.",
        positions: [[6, 7, 'queen'], [6, 8, 'x'], [6, 9, 'x']],
      },
      {
        descPt: "Finalizamos colocando as rainhas nas posições I10 e J5, únicas opções da linha 10 e da coluna J! 🎉",
        descEn: "We finish by placing queens at positions I10 and J5, the only options for row 10 and column J! 🎉",
        positions: [[9, 8, 'queen'], [4, 9, 'queen'], [4, 8, 'x']],
      },
    ],
}