import React from "react";
import Link from "next/link";

const BringOwnMessage = () => {
  return (
    <>
      <h2 className="text-white text-2xl text-center mb-6 font-bold">
        Choosing The Right Instrument
      </h2>
      <h3 className="text-white font-semibold text-xl mb-4">
        Be wary of 'budget' instruments
      </h3>
      <p className="text-white mb-4 leading-8">
        Although 'budget' instruments advertised online or through a
        chain/discount store can present a cheap initial outlay, they are not
        always the best option. Repair costs, poor resale and difficulty in
        playing make these instruments a poor choice. If you are budget
        conscious, consider buying a reputable brand instrument secondhand
        instead.
      </p>
      <p className="text-white mb-4 leading-8">
        'Budget' instruments are generally made of inferior material which won't
        hold up to the rigors of primary school use. They may last 12 months or
        they may last 12 weeks. Once they do need a trip to the repair shop even
        a basic service will cost around $110. In fact, most repairers refuse to
        work on 'budget' instruments altogether.
      </p>
      <p className="text-white mb-4 leading-8">
        Also be aware that many 'budget' brand instruments save money by leaving
        out features and materials that make it easier to play for young
        musicians. This makes learning harder for your child, decreasing their
        chance of success.
      </p>
      <p className="text-white mb-4 leading-8">
        Purchasing a reputable brand will ensure your child is learning on a
        durable instrument that is easier to play and will hold greater resale
        value. It gives the best chance of success and will almost certainly
        cost you less in the long run.
      </p>
      <p className="text-white mb-4 leading-8">
        If you'd like advice on which brands are reputable, or where you may
        find suitable second hand options please contact us on{" "}
        <Link href="tel:(02)96517333" className="text-[#F6BD60] underline">
          9651 7333
        </Link>{" "}
        (extension #2).
      </p>
    </>
  );
};

export default BringOwnMessage;
