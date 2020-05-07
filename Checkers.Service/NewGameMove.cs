namespace Checkers.Service
{
    public class NewGameMove
    {
        public NewGameMove()
        {
            this.GameId = string.Empty;
            this.Move = new GameMove();
        }

        public string GameId { get; set; }

        /// <summary>
        /// The move to make.
        /// </summary>
        public GameMove Move { get; set; }
    }
}
