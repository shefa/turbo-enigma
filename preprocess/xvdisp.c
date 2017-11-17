#include <stdio.h>
#include <stdlib.h>
#include "allheaders.h"

main( int argc, char **argv)
{
  PIX 	*pixs;
  char 	*filein,*fileout;
  static char mainName[] = "xvdisp";

  if(argc != 5)  exit(ERROR_INT(" Syntax: xvdisp filein fileout type force", mainName, 1));

  filein = argv[1];
  fileout = argv[2];
  int type = argv[3][0] - '0';
  int force = argv[4][0] - '0';
  if((pixs = pixRead(filein)) == NULL ) exit(ERROR_INT("pixs not made", mainName, 1));
	
  float angle,conf;
  //deskewed = pixDeskewLocal(pixs, 10, 0, 0, 0.0, 0.0, 0.0);
  pixs = pixFindSkewAndDeskew(pixs,type,&angle,&conf);
	
  printf("Angle:%f \n Confidence:%f\n", angle, conf);
  //pixDisplay(pixs, 20, 20);
  
  if(force)
  {
	  printf("force rotating pixs ");
    float deg2rad = 3.1415926535 / 180.;
    pixs = pixRotate(pixs, deg2rad * angle, L_ROTATE_AREA_MAP, L_BRING_IN_WHITE, 0,0);
  }

  pixWrite(fileout,pixs,IFF_PNG);
  pixDestroy(&pixs);
  return 0;
}
