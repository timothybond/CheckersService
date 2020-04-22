using System.Threading.Tasks;

namespace Checkers.Service
{
    public interface IGameClient
    {
        Task UpdateClient(Game game);

        Task SendError(string error);
    }
}
