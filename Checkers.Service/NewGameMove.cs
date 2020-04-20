namespace Checkers.Service
{
    public class NewGameMove
    {
        public NewGameMove()
        {
            this.GameId = string.Empty;
        }

        public string GameId { get; set; }

        /// <summary>
        /// The move to make, or <c>null</c> to pass (only valid after a capture that would allow another capture).
        /// </summary>
        public GameMove? Move { get; set; }
    }
}
