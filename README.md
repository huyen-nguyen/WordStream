# WordStream

Demo: https://nnhuyen.github.io/WordStream/
## WordStream: An Interactive Tool for Topic Evolution

![ScreenShot](https://github.com/nnhuyen/WordStream/blob/master/images/Huffington.png)

*WordStream* is a visualization technique for demonstrating the evolution of a topic over time. This is a hybrid 
technique from Wordle and StreamGraph, which conveys textual data with both global and local perpsectives. Global trends
 is described by the total stream, in which thickness represents amount of interest/concern in that specific 
 timepoint. Local trend is retrieved from an individual stream. 

Timeline is shown from 
left to right, in the bottom of the interface. The categories for textual data are color-encoded, for example:
- Blue for *person*
- Orange for *location*
- Green for *organization*
- Red for *others*

The importance of a word is represented by its font size and opacity. In this study, the importance of a is its [Sudden 
attention](https://www.cs.uic.edu/~tdang/TimeArcs/EuroVis2016/TimeArcs_Dang_EuroVis2016.pdf): a word which appear repeatedly throughout the timeline conveys less and less meaning than in its first 
appearance. A word's sudden attention is a function of frequency, which is big when the previous timestep has small 
frequency and this current timestep has high frequency. 
 