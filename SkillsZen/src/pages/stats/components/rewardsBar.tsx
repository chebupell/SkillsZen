const blocks = [
  { title: "Block 1", img: "/block1.png" },
  { title: "Block 2", img: "/block2.png" },
];

function RewardsBar() {
  return (
    <div className="rewardsBar">
         {blocks.map((block) => {
            return(
                <div className="block"></div>
            )
         })}

    </div>
  )}

  export default RewardsBar