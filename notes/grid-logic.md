### How should the grid respond to panel resizing?

if panelWidth === 1 columns:

|[1]|
|[2]|
|[3]|
|[4]|
|[5]|
|[6]|

* flex-direction:

if panelWidth >= 2 columns:

|[1] [5]|
|[2] [6]|
|[3]    |
|[4]    |

* flex-direction: column


So maybe the question is...
if (panelWidth >= numberOfColumns * columnWidth)
  flex-direction: column
