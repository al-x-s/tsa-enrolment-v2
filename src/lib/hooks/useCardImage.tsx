import React from "react";

function useCardImage(cc_number: string | undefined) {
  const [cardImage, setCardImage] = React.useState(`/images/cc_blank.svg`);

  React.useEffect(() => {
    const visaStartRegex = /^4/;
    const masterCardStartRegex = /^(5[1-5]|2(22[1-9]|2[3-9]|[3-6]|7[0-1]|720))/;

    if (cc_number === undefined) {
      return;
    }

    if (visaStartRegex.test(cc_number)) {
      setCardImage(`/images/cc_visa.svg`);
    } else if (masterCardStartRegex.test(cc_number)) {
      setCardImage(`/images/cc_mastercard.svg`);
    } else {
      setCardImage(`/images/cc_blank.svg`);
    }
  }, [cc_number]);

  return cardImage;
}

export default useCardImage;
