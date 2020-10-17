tmux new -d -s dev;
tmux new -d -s run-backend;
tmux new -d -s run-frontend;
tmux send-keys -t dev "cd ${PWD}" Enter;
tmux send-keys -t run-backend "cd ${PWD}" Enter;
tmux send-keys -t run-frontend "cd ${PWD}" Enter;
tmux send-keys -t run-backend "cd backend && npm start" Enter;
tmux send-keys -t run-frontend "cd frontend && npm start" Enter;
tmux a -t dev;
