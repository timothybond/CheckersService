namespace Checkers.Service.Model
{
    /// <summary>
    /// A move, including the unique identifier of the game it takes place in.
    /// </summary>
    public class NewMove
    {
        public NewMove()
        {
            this.GameId = string.Empty;
            this.Move = new Move();
        }

        public string GameId { get; set; }

        /// <summary>
        /// The move to make.
        /// </summary>
        public Move Move { get; set; }
    }
}
