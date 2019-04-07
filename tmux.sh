tmux new -d -s dev;
tmux new -d -s backend-server;
tmux new -d -s frontend-server;
tmux send-keys -t dev "cd ${PWD}" Enter;
tmux send-keys -t backend-server "cd ${PWD}" Enter;
tmux send-keys -t backend-server "npm run backend-server" Enter;
tmux a -t backend-server;
